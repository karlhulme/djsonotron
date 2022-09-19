import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a JSON array schema for the given enum type.
 * @param enumType An enum type.
 */
export function generateJsonSchemaForEnumTypeArray(
  enumType: EnumTypeDef,
): TypescriptTreeConstDeclaration {
  return {
    name: `${enumType.system}${
      capitalizeFirstLetter(enumType.name)
    }ArraySchema`,
    comment:
      `The JSON schema for an array of ${enumType.system}/${enumType.name} types.`,
    exported: true,
    deprecated: Boolean(enumType.deprecated),
    value: JSON.stringify({
      name: `${enumType.system}${capitalizeFirstLetter(enumType.name)}Array`,
      schema: {
        type: "array",
        description: generateJsonSchemaDescriptionText(
          `An array of ${enumType.system}/${enumType.name} types`,
          enumType.deprecated,
        ),
        deprecated: enumType.deprecated ? true : undefined,
        items: {
          type: "string",
          enum: enumType.items.map((item) => item.value),
        },
      },
    }),
  };
}
