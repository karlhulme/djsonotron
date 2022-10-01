import { JsonotronTypeKind } from "../interfaces/index.ts";

/**
 * Returns the underlying Typescript type for the given jsonotron type.
 * @param kind The kind of jsonotron type.
 */
export function getUnderlyingTypeForJsonotronTypeKind(kind: JsonotronTypeKind) {
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
