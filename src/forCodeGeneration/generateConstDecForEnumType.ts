import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import {
  capitalizeFirstLetter,
  stringifyJRuntimeType,
} from "../utils/index.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a const declaration with a validator and JSON schema
 * for the given enum type.
 * @param enumType An enum type.
 */
export function generateConstDecForEnumType(
  enumType: EnumTypeDef,
): TypescriptTreeConstDeclaration {
  return {
    name: `${enumType.system}${capitalizeFirstLetter(enumType.name)}Type`,
    comment:
      `The runtime type information for the ${enumType.system}/${enumType.name} type.`,
    exported: true,
    deprecated: Boolean(enumType.deprecated),
    typeName: "JsonotronRuntimeType",
    value: stringifyJRuntimeType({
      name: `${enumType.system}${capitalizeFirstLetter(enumType.name)}`,
      underlyingType: "string",
      validator: `validate${capitalizeFirstLetter(enumType.system)}${
        capitalizeFirstLetter(enumType.name)
      }`,
      schema: {
        type: "string",
        description: generateJsonSchemaDescriptionText(
          enumType.summary,
          enumType.deprecated || null,
        ),
        deprecated: enumType.deprecated ? true : undefined,
        enum: enumType.items.map((item) => item.value),
      },
      referencedSchemaTypes: [],
    }),
  };
}
