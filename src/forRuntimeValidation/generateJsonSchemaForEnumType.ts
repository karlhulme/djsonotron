import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a JSON schema for the given enum type.
 * @param enumType An enum type.
 */
export function generateJsonSchemaForEnumType(
  enumType: EnumTypeDef,
): TypescriptTreeConstDeclaration {
  return {
    name: `${enumType.system}${capitalizeFirstLetter(enumType.name)}Schema`,
    comment:
      `The JSON schema for the ${enumType.system}/${enumType.name} type.`,
    exported: true,
    deprecated: Boolean(enumType.deprecated),
    value: "`" + JSON.stringify({
      type: "string",
      description: generateJsonSchemaDescriptionText(
        enumType.summary,
        enumType.deprecated,
      ),
      deprecated: enumType.deprecated ? true : undefined,
      enum: enumType.items.map((item) => item.value),
    }) + "`",
  };
}
