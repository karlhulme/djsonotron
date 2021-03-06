import {
  generateTypescript,
  newTypescriptTree,
  TypescriptTree,
  TypescriptTreeClass,
} from "../../deps.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiDocType } from "./SengiDocType.ts";

interface GenerateCodeForTypedSengiProps {
  depsPath: string;
  typesPath: string;
  docTypes: SengiDocType[];
}

export function generateCodeForTypedSengi(
  props: GenerateCodeForTypedSengiProps,
) {
  const tree = generateTypedSengiTree(props);
  const ts = generateTypescript(tree);
  return ts;
}

export function generateTypedSengiTree(
  props: GenerateCodeForTypedSengiProps,
): TypescriptTree {
  const tree = newTypescriptTree();

  tree.lintDirectives.noExplicitAny = true;

  appendImports(tree, props);

  appendValidatorAdapter(tree);

  appendConstructorInterfaces(tree, props);

  appendClass(tree, props);

  return tree;
}

function appendImports(
  tree: TypescriptTree,
  props: GenerateCodeForTypedSengiProps,
) {
  const depsImports = [
    "DocStore",
    "DocTypePolicy",
    "Sengi",
    "ArchiveDocumentProps",
    "DeleteDocumentProps",
    "GetDocumentByIdProps",
    "NewDocumentProps",
    "PatchDocumentProps",
    "QueryDocumentsProps",
    "ReplaceDocumentProps",
    "SelectDocumentByIdProps",
    "SelectDocumentsByFilterProps",
    "SelectDocumentsByIdsProps",
    "SelectDocumentsProps",
  ];

  for (const dep of depsImports) {
    tree.imports.push({
      name: dep,
      path: props.depsPath,
    });
  }

  tree.imports.push({
    name: "ValidationError",
    path: props.typesPath,
  });

  for (const sengiDocType of props.docTypes) {
    tree.imports.push({
      name: `Db${capitalizeFirstLetter(sengiDocType.name)}`,
      path: props.typesPath,
    });

    tree.imports.push({
      name: `validateDb${capitalizeFirstLetter(sengiDocType.name)}`,
      path: props.typesPath,
    });
  }
}

function appendValidatorAdapter(tree: TypescriptTree) {
  tree.functions.push({
    name: "v",
    returnType: "(doc: unknown) => string | void",
    comment:
      "Returns a function that takes a document, validates it using the given validator, and if said validator yields one validation error or more, then the validation errors are stringified.",
    params: [{
      name: "validator",
      typeName: "(value: any, valueDisplayPath: string) => ValidationError[]",
      comment: "A Jsonotron validator function.",
    }],
    lines: `
    return function (doc: unknown): string | void {
      const errors = validator(doc, "doc");
    
      if (errors.length > 0) {
        return JSON.stringify(errors, null, 2);
      }
    };`,
  });
}

function appendConstructorInterfaces(
  tree: TypescriptTree,
  props: GenerateCodeForTypedSengiProps,
) {
  tree.interfaces.push({
    name: "TypedSengiConstructorProps",
    typeParams: ["DocStoreParams", "Filter", "Query"],
    comment: "The properties required to construct a new instance.",
    exported: true,
    members: [{
      name: "docStore",
      typeName: "DocStore<DocStoreParams, Filter, Query>",
      comment:
        "The document store that provides long-term storage for the sengi engine.",
    }, {
      name: "docTypes",
      typeName: "TypedSengiConstructorDocTypes",
      comment: "An array of doc type definitions.",
    }, {
      name: "createDocStoreParams",
      typeName:
        "(docTypeName: string, docTypePluralName: string, ) => DocStoreParams",
      comment:
        "A function that generates doc store parameters using the target doc type name or plural name.",
    }, {
      name: "getNewDocVersion",
      typeName: "() => string",
      comment: "A function that returns a new document version.",
    }, {
      name: "validateUserId",
      typeName: "(value: any, valueDisplayPath: string) => ValidationError[]",
      comment: "A Jsonotron validator function for user id.",
    }, {
      name: "getMillisecondsSinceEpoch",
      typeName: "() => number",
      comment:
        "An optional function that returns the number of milliseconds since the epoch to be used as timestamps.  Date.now is used if not supplied.",
      optional: true,
    }, {
      name: "centralPartition",
      typeName: "string",
      comment:
        "The name of the central partition.  If not supplied a value of _central will be used.",
      optional: true,
    }],
  });

  tree.interfaces.push({
    name: "TypedSengiConstructorDocTypes",
    comment: "The definitions of a set of document types.",
    members: props.docTypes.map((docType) => ({
      name: docType.name,
      typeName: "TypedSengiConstructorDocTypesElement",
      comment: `Information for the ${docType.name} doc type.`,
      optional: true,
    })),
  });

  tree.interfaces.push({
    name: "TypedSengiConstructorDocTypesElement",
    comment: "The definition of a document type.",
    members: [{
      name: "validateDoc",
      typeName: "(doc: any) => string|void",
      comment: "A Jsonotron validator function for the document type.",
      optional: true,
    }, {
      name: "policy",
      typeName: "DocTypePolicy",
      comment: "The policy for the document type.",
      optional: true,
    }],
  });
}

function appendClass(
  tree: TypescriptTree,
  props: GenerateCodeForTypedSengiProps,
) {
  const ctorDocTypeProps: string[] = [];

  for (const docType of props.docTypes) {
    const capName = capitalizeFirstLetter(docType.name);
    const readOnlyFieldNames = docType.properties
      .filter((p) => p.isReadOnly)
      .map((p) => `"${p.name}"`);

    ctorDocTypeProps.push(`{
      name: "${docType.name}",
      readOnlyFieldNames: [${readOnlyFieldNames.join(", ")}],
      validateFields: v(validateDb${capName}),
      validateDoc: props.docTypes.${docType.name}?.validateDoc || (() => {}),
      policy: props.docTypes.${docType.name}?.policy,
    }`);
  }

  const typedSengiClass: TypescriptTreeClass = {
    name: "TypedSengi",
    typeParams: ["DocStoreParams", "Filter", "Query"],
    comment: "Provides methods for retrieving, storing and mutating documents.",
    exported: true,
    privateVars: [{
      name: "sengi",
      typeName: "Sengi<DocStoreParams, Filter, Query>",
    }, {
      name: "createDocStoreParams",
      typeName:
        "(docTypeName: string, docTypePluralName: string) => DocStoreParams",
    }, {
      name: "centralPartition",
      typeName: "string",
    }],
    ctor: {
      params: [{
        name: "props",
        typeName: "TypedSengiConstructorProps<DocStoreParams, Filter, Query>",
        comment: "The properties required to initialise the instance.",
      }],
      lines: `
        this.sengi = new Sengi({
          docStore: props.docStore,
          docTypes: [${ctorDocTypeProps.join(",\n")}],
          getMillisecondsSinceEpoch: props.getMillisecondsSinceEpoch,
          getNewDocVersion: props.getNewDocVersion,
          validateUserId: v(props.validateUserId),
          patchDocStoreParams: props.createDocStoreParams("patch", "patches"),
        });
    
        this.createDocStoreParams = props.createDocStoreParams;
        this.centralPartition = props.centralPartition || "_central";
      `,
    },
  };

  typedSengiClass.functions = [];

  for (const docType of props.docTypes) {
    const capName = capitalizeFirstLetter(docType.name);
    const capPluralName = capitalizeFirstLetter(docType.pluralName);

    let omittedPropertyNames = `"docStoreParams"|"docTypeName"`;

    if (docType.useSinglePartition) {
      omittedPropertyNames += `|"partition"`;
    }

    const partitionAssignment = docType.useSinglePartition
      ? `partition: this.centralPartition || "_central",`
      : "";

    // Archive doc
    typedSengiClass.functions.push({
      name: `archive${capName}`,
      comment: `Archive a ${docType.name} record.`,
      params: [{
        name: "props",
        typeName:
          `Omit<ArchiveDocumentProps<DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to archive a record.",
      }],
      lines: `
        return this.sengi.archiveDocument<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Create doc
    typedSengiClass.functions.push({
      name: `new${capName}`,
      comment: `Create a new ${docType.name} record.`,
      params: [{
        name: "props",
        typeName:
          `Omit<NewDocumentProps<Db${capName}, DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to create a new record.",
      }],
      lines: `
        return this.sengi.newDocument<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        });
      `,
    });

    // Delete doc
    typedSengiClass.functions.push({
      name: `delete${capName}`,
      comment: `Delete a ${docType.name} record.`,
      params: [{
        name: "props",
        typeName:
          `Omit<DeleteDocumentProps<DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to delete a record.",
      }],
      lines: `
        return this.sengi.deleteDocument({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Patch doc
    typedSengiClass.functions.push({
      name: `patch${capName}`,
      comment: `Patch a ${docType.name} record.`,
      params: [{
        name: "props",
        typeName:
          `Omit<PatchDocumentProps<Db${capName}, DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to patch a record.",
      }],
      lines: `
        return this.sengi.patchDocument({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Replace doc
    typedSengiClass.functions.push({
      name: `replace${capName}`,
      comment: `Replace a ${docType.name} record.`,
      params: [{
        name: "props",
        typeName:
          `Omit<ReplaceDocumentProps<Db${capName}, DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to replace an existing record.",
      }],
      lines: `
        return this.sengi.replaceDocument<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Query doc
    typedSengiClass.functions.push({
      name: `query${capPluralName}`,
      comment: `Query the ${docType.name} records.`,
      typeParams: ["QueryResult"],
      params: [{
        name: "props",
        typeName:
          `Omit<QueryDocumentsProps<Query, QueryResult, DocStoreParams>, "docStoreParams"|"docTypeName">`,
        comment: "The properties required to query a set of records.",
      }],
      lines: `
        return this.sengi.queryDocuments<QueryResult>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
        })
      `,
    });

    // Select docs
    typedSengiClass.functions.push({
      name: `select${capPluralName}`,
      comment: `Select ${docType.name} records.`,
      params: [{
        name: "props",
        typeName:
          `Omit<SelectDocumentsProps<DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to select a set of records.",
      }],
      lines: `
        return this.sengi.selectDocuments<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Select docs by ids
    typedSengiClass.functions.push({
      name: `select${capPluralName}ByIds`,
      comment: `Select ${docType.name} records by ids.`,
      params: [{
        name: "props",
        typeName:
          `Omit<SelectDocumentsByIdsProps<DocStoreParams>, ${omittedPropertyNames}>`,
        comment:
          "The properties required to select a set of records using an array of ids.",
      }],
      lines: `
        return this.sengi.selectDocumentsByIds<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Select docs by filters
    typedSengiClass.functions.push({
      name: `select${capPluralName}ByFilter`,
      comment: `Select ${docType.name} records using a filter.`,
      params: [{
        name: "props",
        typeName:
          `Omit<SelectDocumentsByFilterProps<Filter, DocStoreParams>, ${omittedPropertyNames}>`,
        comment:
          "The properties required to select a set of records using a filter.",
      }],
      lines: `
        return this.sengi.selectDocumentsByFilter<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Select by id
    typedSengiClass.functions.push({
      name: `select${capName}`,
      comment: `Select ${docType.name} record.`,
      params: [{
        name: "props",
        typeName:
          `Omit<SelectDocumentByIdProps<DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to select a record.",
      }],
      lines: `
        return this.sengi.selectDocumentById<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });

    // Get by id
    typedSengiClass.functions.push({
      name: `get${capName}`,
      comment: `Retrieve a ${docType.name} record.`,
      params: [{
        name: "props",
        typeName:
          `Omit<GetDocumentByIdProps<DocStoreParams>, ${omittedPropertyNames}>`,
        comment: "The properties required to retrieve a record.",
      }],
      lines: `
        return this.sengi.getDocumentById<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
          ${partitionAssignment}
        })
      `,
    });
  }

  tree.classes.push(typedSengiClass);
}
