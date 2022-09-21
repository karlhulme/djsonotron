import { TypescriptTreeInterface } from "../../deps.ts";

/**
 * Returns an interface for a runtime jsonotron type.
 */
export function generateRuntimeTypeInterface(): TypescriptTreeInterface {
  return {
    name: "JsonotronRuntimeType",
    exported: true,
    comment: "Describes a Jsonotron type with schema and validator.",
    members: [{
      name: "name",
      typeName: "string",
      comment:
        "The fully qualified name of the type, e.g. std/positiveInteger.",
    }, {
      name: "schema",
      typeName: "unknown",
      comment: "A JSON schema object.",
    }, {
      name: "underlyingType",
      typeName: `"string"|"number"|"boolean"|"object"|"array"`,
      comment: "The underlying type.",
    }, {
      name: "referencedSchemaTypes",
      typeName: "string[]",
      comment:
        "The names of the JSON schemas types referenced by this JSON schema.",
    }, {
      name: "validator",
      typeName: "(value: any, valueDisplayPath: string) => ValidationError[]",
      comment:
        "A function that evaluates a value and returns validation errors.",
    }],
  };
}
