import { generateTypescript, newTypescriptTree } from "../../deps.ts";
import { appendJsonotronTypesToTree } from "../forCodeGeneration/index.ts";
import { EnumTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { stdSystemTypes } from "../std/index.ts";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter.ts";
import { createArchiveDocumentFunc } from "./createArchiveDocumentFunc.ts";
import { createDeleteDocumentFunc } from "./createDeleteDocumentFunc.ts";
import { createGetDocumentByIdFunc } from "./createGetDocumentByIdFunc.ts";
import { createNewDocumentFunc } from "./createNewDocumentFunc.ts";
import { createPatchDocumentFunc } from "./createPatchDocumentFunc.ts";
import { createQueryDocumentsFunc } from "./createQueryDocumentsFunc.ts";
import { createRedactDocumentFunc } from "./createRedactDocumentFunc.ts";
import { createReplaceDocumentFunc } from "./createReplaceDocumentFunc.ts";
import { createSelectDocumentByIdFunc } from "./createSelectDocumentById.ts";
import { createSelectDocumentsByFilterFunc } from "./createSelectDocumentsByFilterFunc.ts";
import { createSelectDocumentsByIdsFunc } from "./createSelectDocumentsByIdsFunc.ts";
import { createSelectDocumentsFunc } from "./createSelectDocumentsFunc.ts";
import { createSengiStandardProperties } from "./createSengiStandardProperties.ts";

/**
 * The properties for generating a typed interface to
 * a Mongo database.
 */
interface Props {
  /**
   * An array of objects describing the sengi document
   * collections.  These should be pre-validated by loading
   * them from JSON files with the $schema key set to
   * https://raw.githubusercontent.com/karlhulme/djsonotron/main/schemas/sengi.json.
   */
  // deno-lint-ignore no-explicit-any
  collections: any[];

  /**
   * The application name in camel case.
   * This is used for environment variable names.
   */
  appName: string;

  /**
   * The name of the service in camel case.
   * This is used as a prefix for all collection names.
   */
  svcName: string;

  /**
   * The path to the deps.ts file.
   */
  depsPath: string;
}

/**
 * Generates a series of strongly typed functions for
 * interacting with a Mongo database based on a set of
 * document collection definitions.  The definitions must
 * adhere to the schema defined at
 * https://raw.githubusercontent.com/karlhulme/djsonotron/main/schemas/sengi.json
 * and will typically be loaded from JSON files in a db
 * folder in the root of a service repository.
 */
export function generateCodeForMongoDatabase(props: Props) {
  // Create the typescript tree for all the types and functions
  // that we're going to define.
  const tree = newTypescriptTree();

  // Add the imports that are expected to be in the deps file.
  tree.imports.push(
    ...[
      "MongoDbDocStore",
      "MongoDbDocStoreFilter",
      "MongoDbDocStoreParams",
      "MongoDbDocStoreQuery",
      "generateIdWithPrefix",
      "Sengi",
    ].map((impt) => ({ name: impt, path: props.depsPath })),
  );

  // Add the Sengi constants
  tree.constDeclarations.push({
    name: "SYSTEM_USER_ID",
    value: `"user_system"`,
    exported: true,
  });

  // Add the Mongo constants
  tree.constDeclarations.push({
    name: `${props.appName}ConnectionString`,
    value:
      `Deno.env.get("${props.appName.toUpperCase()}_MONGO_URL") || "<BLANK_MONGO_URL>"`,
  });
  tree.constDeclarations.push({
    name: `${props.appName}MongoStrict`,
    value:
      `Boolean(Deno.env.get("${props.appName.toUpperCase()}_MONGO_STRICT"))`,
  });
  tree.constDeclarations.push({
    name: `${props.appName}MongoDbName`,
    value:
      `Deno.env.get("${props.appName.toUpperCase()}_MONGO_DB") || "<BLANK_MONGO_DB>`,
  });
  tree.constDeclarations.push({
    name: `${props.appName}MongoPerfLogging`,
    value:
      `Boolean(Deno.env.get("${props.appName.toUpperCase()}_MONGO_PERF_LOG"))`,
  });

  // Add the type definitions needed for the functions for
  // creating, patching and replacing documents.
  tree.types.push({
    name: "PartialNullable<T>",
    def: "{ [K in keyof T]?: T[K] | null };",
  });
  tree.types.push({
    name: "OmittedNewDocumentFieldNames",
    def: `"id"
      | "docType"
      | "docStatus"
      | "docVersion"
      | "docOpIds"
      | "docDigests"
      | "docCreatedByUserId"
      | "docCreatedMillisecondsSinceEpoch"
      | "docLastUpdatedByUserId"
      | "docLastUpdatedMillisecondsSinceEpoch"
      | "docArchivedByUserId"
      | "docArchivedMillisecondsSinceEpoch"
      | "docRedactedByUserId"
      | "docRedactedMillisecondsSinceEpoch";`,
  });
  tree.types.push({
    name: "OmittedPatchDocumentFieldNames",
    def: `"id"
      | "docType"
      | "docStatus"
      | "docVersion"
      | "docOpIds"
      | "docDigests"
      | "docCreatedByUserId"
      | "docCreatedMillisecondsSinceEpoch"
      | "docLastUpdatedByUserId"
      | "docLastUpdatedMillisecondsSinceEpoch"
      | "docArchivedByUserId"
      | "docArchivedMillisecondsSinceEpoch"
      | "docRedactedByUserId"
      | "docRedactedMillisecondsSinceEpoch";`,
  });
  tree.types.push({
    name: "OmittedReplaceDocumentFieldNames",
    def: `"docVersion"
      | "docOpIds"
      | "docDigests"
      | "docCreatedByUserId"
      | "docCreatedMillisecondsSinceEpoch"
      | "docLastUpdatedByUserId"
      | "docLastUpdatedMillisecondsSinceEpoch"
      | "docArchivedByUserId"
      | "docArchivedMillisecondsSinceEpoch"
      | "docRedactedByUserId"
      | "docRedactedMillisecondsSinceEpoch";`,
  });

  // Create a list of types and seed it with the standard types.
  const types = [...stdSystemTypes];

  // Create an array of sengi doc types that can be serialized
  // into the constructor that we output at the end.
  const sengiDocTypes = [];

  // Loop over all the JSON files in the directory.
  for (const col of props.collections) {
    try {
      // Check the collection is pre-validated.
      if (
        col["$schema"] !==
          "https://raw.githubusercontent.com/karlhulme/djsonotron/main/schemas/sengi.json"
      ) {
        throw new Error(
          `The $schema property on the collection was not recognised.\n${
            col["$schema"]
          }`,
        );
      }

      // Create a doc type definition.
      sengiDocTypes.push(`{
        name: "${col.name}",
        docStoreParams: {
          databaseName: ${props.appName}MongoDbName,
          collectionName: "${props.svcName}_${col.pluralName}",
        },
        useSinglePartition: ${col.useSinglePartition ? "true" : "false"},
        validateFields: validateErrorsToString(validate${
        capitalizeFirstLetter(col.system)
      }${capitalizeFirstLetter(col.name)}),
        validateDoc: () => {},
        newId: () => generateIdWithPrefix("${col.idPrefix}"),
        storePatches: ${col.storePatches ? "true" : "false"},
        trackChanges: ${col.trackChanges ? "true" : "false"},
        changeFieldNames: ${JSON.stringify(col.changeFieldNames)},
        redactFields: ${JSON.stringify(col.redactFields)},
        policy: ${JSON.stringify(col.policy || {})}
      }`);

      // Create a record definition from the top-level sengi definition.
      types.push({
        system: col.system,
        kind: "record",
        name: col.name,
        pluralName: col.pluralName,
        summary: col.summary,
        labels: col.labels,
        tags: col.tags,
        properties: [
          ...createSengiStandardProperties(col.name),
          ...col.properties,
        ],
        deprecated: col.deprecated,
      } as RecordTypeDef<string>);

      // Create an enum definition from any child enums defined in this sengi file.
      if (
        typeof col.types === "object" &&
        Array.isArray(col.types.enums)
      ) {
        for (const sengiEnum of col.types.enums) {
          types.push({
            system: col.system,
            kind: "enum",
            name: sengiEnum.name,
            pluralName: sengiEnum.pluralName,
            summary: sengiEnum.summary,
            deprecated: col.deprecated,
            items: sengiEnum.items,
          } as EnumTypeDef);
        }
      }

      // Create a record definition from any child records defined in this sengi file.
      if (
        typeof col.types === "object" &&
        Array.isArray(col.types.records)
      ) {
        for (const sengiRecord of col.types.records) {
          types.push({
            system: col.system,
            kind: "record",
            name: sengiRecord.name,
            pluralName: sengiRecord.pluralName,
            summary: sengiRecord.summary,
            deprecated: col.deprecated,
            properties: sengiRecord.properties,
          } as RecordTypeDef<string>);
        }
      }

      // Add the typed methods for this sengi file.
      tree.functions.push(createArchiveDocumentFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createDeleteDocumentFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createGetDocumentByIdFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createNewDocumentFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createPatchDocumentFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createQueryDocumentsFunc(
        col.system,
        col.name,
        col.pluralName,
        "MongoDbDocStoreQuery",
      ));
      tree.functions.push(createRedactDocumentFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createReplaceDocumentFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createSelectDocumentByIdFunc(
        col.system,
        col.name,
        col.useSinglePartition,
      ));
      tree.functions.push(createSelectDocumentsFunc(
        col.system,
        col.name,
        col.pluralName,
        col.useSinglePartition,
      ));
      tree.functions.push(createSelectDocumentsByFilterFunc(
        col.system,
        col.name,
        col.pluralName,
        col.useSinglePartition,
        "MongoDbDocStoreFilter",
      ));
      tree.functions.push(createSelectDocumentsByIdsFunc(
        col.system,
        col.name,
        col.pluralName,
        col.useSinglePartition,
      ));
    } catch (err) {
      throw new Error(
        `Unable to create functions for definition.\n${err}\n${
          JSON.stringify(col)
        }`,
      );
    }
  }

  // Append all the type definitions to the tree.
  appendJsonotronTypesToTree(tree, types, "#/components/schemas/");

  // Declare the doc store instance based on Mongo.
  tree.constDeclarations.push({
    name: "docStore",
    outputGeneration: 1,
    value: `new MongoDbDocStore({
      connectionString: ${props.appName}ConnectionString,
      strict: ${props.appName}MongoStrict,
      generateDocVersionFunc: () => {
        const len = 16
        const buf = new Uint8Array(len / 2);
        crypto.getRandomValues(buf);
        let ret = "";
        for (let i = 0; i < buf.length; ++i) {
          ret += ("0" + buf[i].toString(16)).slice(-2);
        }
        return ret;
      }
    })`,
  });

  // Add a close function for the Mongo doc store.
  tree.functions.push({
    name: "closeMongoConnection",
    params: [],
    exported: true,
    comment: "Close the connection to the Mongo database.",
    outputGeneration: 2,
    lines: "return docStore.close();",
  });

  // Declare the sengi instance based on Mongo.
  tree.constDeclarations.push({
    name: "sengi",
    outputGeneration: 1,
    value: `new Sengi<
      DbTypeNames,
      MongoDbDocStoreParams,
      MongoDbDocStoreFilter,
      MongoDbDocStoreQuery
    >({
      docStore,
      docTypes: [${sengiDocTypes.join(", ")}],
      patchDocStoreParams: {
        databaseName: ${props.appName}MongoDbName,
        collectionName: "${props.svcName}_patches",
      },
      changeDocStoreParams: {
        databaseName: ${props.appName}MongoDbName,
        collectionName: "${props.svcName}_changes",
      },
      validateUserId: validateErrorsToString(validateStdIdWithPrefix),
      logPerformance: ${props.appName}MongoPerfLogging
    });`,
  });

  // Add a function for retrieving document patches.
  tree.functions.push({
    name: "selectPatches",
    params: [{
      name: "documentId",
      typeName: "string",
      comment: "The id of a document.",
    }],
    exported: true,
    comment: "Retrieve the patches for a given document id.",
    outputGeneration: 2,
    lines: "return sengi.getPatches(documentId);",
  });

  // Convert the Typescript tree to code.
  return generateTypescript(tree);
}
