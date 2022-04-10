import { JsonotronTypeDef } from "../interfaces/index.ts";
import { getJsonotronTypeFormalName } from "../utils/index.ts";

export function determineJsonSchemaTypeForJsonotronType(
  type: JsonotronTypeDef,
) {
  if (type.kind === "bool") {
    return {
      type: "boolean",
    };
  } else if (type.kind === "enum" || type.kind === "record") {
    return {
      $ref: `#/components/schemas/${getJsonotronTypeFormalName(type)}`,
    };
  } else if (type.kind === "float" || type.kind === "int") {
    return {
      type: "number",
    };
  } else if (type.kind === "string") {
    return {
      type: "string",
    };
  } else {
    return {};
  }
}
