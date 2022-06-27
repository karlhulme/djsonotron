import { OpenApiSpecComponentSchema } from "../../deps.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateJsonSchemaForEnumType(
  enumType: EnumTypeDef,
): OpenApiSpecComponentSchema {
  return {
    type: "string",
    description: generateDescriptionText(enumType.summary, enumType.deprecated),
    deprecated: enumType.deprecated ? true : undefined,
    enum: enumType.items.map((item) => item.value),
  };
}
