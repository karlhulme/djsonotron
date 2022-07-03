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
  const depsImports = ["DocStore", "NewDocumentProps", "Sengi"];

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
        "(docTypeName: string, docTypePluralName: string, ) => DocStoreParams;",
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
      typeName: "(value: any, valueDisplayPath: string) => ValidationError[]",
      comment: "A Jsonotron validator function for the document type.",
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
      validateDoc: props.docTypes.${docType.name}?.validateDoc
        ? v(props.docTypes.${docType.name}?.validateDoc)
        : (() => {})
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
    }],
    ctor: {
      params: [{
        name: "props",
        typeName: "TypedSengiConstructorProps<DocStoreParams, Filter, Query>",
      }],
      lines: `
        this.sengi = new Sengi({
          docStore: props.docStore,
          docTypes: [${ctorDocTypeProps.join(",\n")}],
          getMillisecondsSinceEpoch: props.getMillisecondsSinceEpoch,
          getNewDocVersion: props.getNewDocVersion,
          validateUserId: v(props.validateUserId),
        });
    
        this.createDocStoreParams = props.createDocStoreParams;
      `,
    },
  };

  typedSengiClass.functions = [];

  for (const docType of props.docTypes) {
    const capName = capitalizeFirstLetter(docType.name);

    // New doc
    typedSengiClass.functions.push({
      name: `new${capName}`,
      params: [{
        name: "props",
        typeName:
          `Omit<NewDocumentProps<Db${capName}, DocStoreParams>, "docStoreParams" | "docTypeName">`,
      }],
      lines: `
        return this.sengi.newDocument<Db${capName}>({
          ...props,
          docTypeName: "${docType.name}",
          docStoreParams: this.createDocStoreParams("${docType.name}", "${docType.pluralName}"),
        });
      `,
    });

    // Create doc

    // Delete doc

    // Operate on doc

    // Patch doc

    // Replace doc

    // Query doc

    // Select docs (x3)

    tree.classes.push(typedSengiClass);
  }

  return typedSengiClass;
}
