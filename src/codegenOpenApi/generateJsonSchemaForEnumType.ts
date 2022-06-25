import { OpenApiSpecSchema } from "../../deps.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateJsonSchemaForEnumType(
  enumType: EnumTypeDef,
): OpenApiSpecSchema {
  return {
    type: "string",
    title: "One of the enum values.",
    description: generateDescriptionText(enumType.summary, enumType.deprecated),
    deprecated: enumType.deprecated ? true : undefined,
    enum: enumType.items.map((item) => item.value),
  };
}
