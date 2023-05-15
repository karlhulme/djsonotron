// deno-lint-ignore-file no-explicit-any
import { generateTypescript, newTypescriptTree } from "../../deps.ts";
import { EnumTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { stdSystemTypes } from "../std/index.ts";
import { appendJsonotronTypesToTree } from "../forCodeGeneration/index.ts";
import { createOperationConst } from "./createOperationConst.ts";
import {
  headerSchemaUrl,
  outboundHeaderSchemaUrl,
  outboundRecordSchemaUrl,
  routeSchemaUrl,
} from "./schemaUrls.ts";

/**
 * The properties required to generate the code for an api router.
 */
interface Props {
  /**
   * An array of JSON-based resources.
   */
  resources: any[];

  /**
   * The path to the deps.ts file.
   */
  depsPath: string;
}

/**
 * Returns the source code for drouter operation functions
 * which can be passed directly to the drouter constructor.
 * @param props A property bag.
 */
export function generateCodeForApiRouter(props: Props) {
  // Create the typescript tree for all the types and functions
  // that we're going to define.
  const tree = newTypescriptTree();

  // Add the imports that are expected to be in the deps file.
  tree.imports.push(
    ...[
      "Operation",
      "HttpError",
    ].map((impt) => ({ name: impt, path: props.depsPath })),
  );

  // Create a list of types and seed it with the standard types.
  const types = [...stdSystemTypes];

  // Start a list of operations
  const operationNames: string[] = [];

  for (const resource of props.resources) {
    if (resource["$schema"] === outboundRecordSchemaUrl) {
      // Create a record definition from the top-level outbound record.
      types.push({
        system: resource.system,
        kind: "record",
        name: resource.name,
        pluralName: resource.pluralName,
        summary: resource.summary,
        labels: resource.labels,
        tags: resource.tags,
        properties: resource.properties,
        deprecated: resource.deprecated,
      } as RecordTypeDef<string>);

      // Create an enum definition from any child enums defined in this outbound record.
      if (
        typeof resource.types === "object" &&
        Array.isArray(resource.types.enums)
      ) {
        for (const resEnum of resource.types.enums) {
          types.push({
            system: resource.system,
            kind: "enum",
            name: resEnum.name,
            pluralName: resEnum.pluralName,
            summary: resEnum.summary,
            deprecated: resource.deprecated,
            items: resEnum.items,
          } as EnumTypeDef);
        }
      }

      // Create a record definition from any child records defined in this outbound record.
      if (
        typeof resource.types === "object" &&
        Array.isArray(resource.types.records)
      ) {
        for (const resRecord of resource.types.records) {
          types.push({
            system: resource.system,
            kind: "record",
            name: resRecord.name,
            pluralName: resRecord.pluralName,
            summary: resRecord.summary,
            deprecated: resource.deprecated,
            properties: resRecord.properties,
          } as RecordTypeDef<string>);
        }
      }
    } else if (resource["$schema"] === routeSchemaUrl) {
      for (const method of resource.methods) {
        // Create a const declaration for the method that can be
        // override by code within the service.
        tree.constDeclarations.push(
          createOperationConst(resource, method, props.resources),
        );

        // Update the list of operation names for export as a
        // single array at the end.
        operationNames.push(method.operationId);

        // Create a record definition from the method request body.
        if (Array.isArray(method.requestBodyProperties)) {
          types.push({
            system: resource.system,
            kind: "record",
            name: `${method.operationId}RequestBody`,
            pluralName: `${method.operationId}RequestBodies`,
            summary:
              `The request body for the ${method.operationId} operation.`,
            labels: [],
            tags: [],
            properties: method.requestBodyProperties,
          } as RecordTypeDef<string>);

          // Create an enum definition from any child enums defined in this method request body.
          if (
            typeof method.requestBodyTypes === "object" &&
            Array.isArray(method.requestBodyTypes.enums)
          ) {
            for (const rbEnum of method.requestBodyTypes.enums) {
              types.push({
                system: resource.system,
                kind: "enum",
                name: rbEnum.name,
                pluralName: rbEnum.pluralName,
                summary: rbEnum.summary,
                deprecated: resource.deprecated,
                items: rbEnum.items,
              } as EnumTypeDef);
            }
          }

          // Create a record definition from any child records defined in this outbound record.
          if (
            typeof method.requestBodyTypes === "object" &&
            Array.isArray(method.requestBodyTypes.records)
          ) {
            for (const rbRecord of method.requestBodyTypes.records) {
              types.push({
                system: resource.system,
                kind: "record",
                name: rbRecord.name,
                pluralName: rbRecord.pluralName,
                summary: rbRecord.summary,
                deprecated: resource.deprecated,
                properties: rbRecord.properties,
              } as RecordTypeDef<string>);
            }
          }
        }
      }
    } else if (
      [
        headerSchemaUrl,
        outboundHeaderSchemaUrl,
      ].includes(resource["$schema"])
    ) {
      // No types are defined in these resources.
    } else {
      throw new Error(
        `The $schema property on the resource was not recognised.\n${
          resource["$schema"]
        }`,
      );
    }
  }

  // Append all the type definitions to the tree.
  appendJsonotronTypesToTree(tree, types, "#/components/schemas/");

  // append methods into an array that can be added to router
  tree.constDeclarations.push({
    name: "allOperations",
    value: "[" + operationNames.join(", ") + "]",
    exported: true,
    outputGeneration: 3,
  });

  return generateTypescript(tree);
}
