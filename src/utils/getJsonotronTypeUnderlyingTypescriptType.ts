import { JsonotronTypeDef } from "../interfaces/index.ts";
import { getJsonotronTypeFormalName } from "./getJsonotronTypeFormalName.ts";

/**
 * Returns the typescript type that represents the given type.
 * @param type A jsonotron type.
 */
export function getJsonotronTypeUnderlyingTypescriptType(
  type: JsonotronTypeDef,
) {
  if (type.kind === "bool") {
    return "boolean";
  } else if (type.kind === "float" || type.kind === "int") {
    return "number";
  } else if (type.kind === "object") {
    return "unknown";
  } else if (type.kind === "string") {
    return "string";
  } else {
    return getJsonotronTypeFormalName(type);
  }
}
