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
      comment: "The full name of the type, e.g. stdPositiveInteger.",
    }, {
      name: "schema",
      typeName: "unknown",
      comment: "A JSON schema object.",
    }, {
      name: "underlyingType",
      typeName: `"string"|"number"|"boolean"|"object"|"array"|"unknown"`,
      comment: "The underlying type.",
    }, {
      name: "referencedSchemaTypes",
      typeName: "string[]",
      comment: "The JSON schema types referenced by this schema.",
    }, {
      name: "validator",
      typeName: "(value: any, valueDisplayPath: string) => ValidationError[]",
      comment:
        "A function that evaluates a value and returns validation errors.",
    }],
  };
}
