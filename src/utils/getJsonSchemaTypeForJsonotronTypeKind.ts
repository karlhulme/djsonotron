import { JsonotronTypeKind } from "../interfaces/index.ts";

/**
 * Returns the equivalent JSON schema type value for the
 * given jsonotron type.
 * @param typeDef A jsonotron type.
 */
export function getJsonSchemaTypeForJsonotronTypeKind(kind: JsonotronTypeKind) {
  switch (kind) {
    case "bool":
      return "boolean";
    case "int":
    case "float":
      return "number";
    default:
    case "object":
    case "record":
      return "object";
    case "enum":
    case "string":
      return "string";
    case "variant":
      return "unknown";
  }
}
