import { EnumTypeDef } from "../interfaces/index.ts";

export function generateJsonSchemaForEnumType(
  enumType: EnumTypeDef,
): Record<string, unknown> {
  return {
    type: "string",
    enum: enumType.items.map((item) => item.value),
  };
}
