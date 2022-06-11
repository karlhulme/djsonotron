import { EnumTypeDef } from "../interfaces/index.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateJsonSchemaForEnumType(
  enumType: EnumTypeDef,
): Record<string, unknown> {
  return {
    type: "string",
    title: `One of the ${enumType.name} values.`,
    description: generateDescriptionText(enumType.summary, enumType.deprecated),
    deprecated: enumType.deprecated ? true : undefined,
    enum: enumType.items.map((item) => item.value),
  };
}
