import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import {
  capitalizeFirstLetter,
  stringifyJRuntimeType,
} from "../utils/index.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a const declaration with an array validator and JSON array schema
 * for the given enum type.
 * @param enumType An enum type.
 * @param componentSchemasPath The path to the component schemas.
 */
export function generateConstDecForEnumTypeArray(
  enumType: EnumTypeDef,
  componentSchemasPath: string,
): TypescriptTreeConstDeclaration {
  return {
    name: `${enumType.system}${capitalizeFirstLetter(enumType.name)}ArrayType`,
    comment:
      `The JSON schema for an array of ${enumType.system}/${enumType.name} types.`,
    exported: true,
    deprecated: Boolean(enumType.deprecated),
    typeName: "JsonotronRuntimeType",
    value: stringifyJRuntimeType({
      name: `${enumType.system}${capitalizeFirstLetter(enumType.name)}Array`,
      underlyingType: "array",
      validator: `validate${capitalizeFirstLetter(enumType.system)}${
        capitalizeFirstLetter(enumType.name)
      }Array`,
      schema: {
        type: "array",
        description: generateJsonSchemaDescriptionText(
          `An array of ${enumType.system}/${enumType.name} types`,
          enumType.deprecated,
        ),
        deprecated: enumType.deprecated ? true : undefined,
        items: {
          $ref: `${componentSchemasPath}${enumType.system}${
            capitalizeFirstLetter(enumType.name)
          }`,
          enum: enumType.items.map((item) => item.value),
        },
      },
      referencedSchemaTypes: [
        `${enumType.system}${capitalizeFirstLetter(enumType.name)}`,
      ],
    }),
  };
}
