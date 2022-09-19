import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import {
  capitalizeFirstLetter,
  getJsonSchemaTypeForJsonotronTypeKind,
} from "../utils/index.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a const declaration with an array validator and JSON array schema
 * for the given record type.
 * This function works for all Jsonotron types but there are specialised
 * methods for enum and record types.
 * @param typeDef A jsonotron type.
 */
export function generateConstDecForJsonotronTypeArray(
  typeDef: JsonotronTypeDef,
): TypescriptTreeConstDeclaration {
  return {
    name: `${typeDef.system}${capitalizeFirstLetter(typeDef.name)}ArrayType`,
    comment:
      `The schema and validator for the ${typeDef.system}/${typeDef.name} array type.`,
    exported: true,
    deprecated: Boolean(typeDef.deprecated),
    typeName: "JsonotronRuntimeType",
    value: JSON.stringify({
      name: `${typeDef.system}${capitalizeFirstLetter(typeDef.name)}Array`,
      underlyingType: "array",
      validator: `validate${capitalizeFirstLetter(typeDef.system)}${
        capitalizeFirstLetter(typeDef.name)
      }Array`,
      schema: {
        type: "array",
        description: generateJsonSchemaDescriptionText(
          `An array of ${typeDef.system}/${typeDef.name} types.`,
          typeDef.deprecated,
        ),
        deprecated: typeDef.deprecated ? true : undefined,
        items: {
          type: getJsonSchemaTypeForJsonotronTypeKind(typeDef.kind),
        },
      },
    }),
  };
}
