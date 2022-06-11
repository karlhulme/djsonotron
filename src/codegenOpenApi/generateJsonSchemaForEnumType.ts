import { EnumTypeDef } from "../interfaces/index.ts";

export function generateJsonSchemaForEnumType(
  enumType: EnumTypeDef,
): Record<string, unknown> {
  return {
    type: "string",
    title: `One of the ${enumType.name} values.`,
    description: enumType.summary,
    deprecated: enumType.deprecated,
    enum: enumType.items.map((item) => item.value),
  };
}
