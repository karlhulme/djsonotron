import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import {
  capitalizeFirstLetter,
  stringifyJRuntimeType,
} from "../utils/index.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a const declaration with an array validator and JSON array schema
 * for the given record type.
 * This function works for all Jsonotron types but there are specialised
 * methods for enum and record types.
 * @param typeDef A jsonotron type.
 * @param componentSchemasPath The path where the components can be referenced from.
 */
export function generateConstDecForJsonotronTypeArray(
  typeDef: JsonotronTypeDef,
  componentSchemasPath: string,
): TypescriptTreeConstDeclaration {
  return {
    name: `${typeDef.system}${capitalizeFirstLetter(typeDef.name)}ArrayType`,
    comment: `The runtime type information for the ${typeDef.system}${
      capitalizeFirstLetter(typeDef.name)
    } array type.`,
    exported: true,
    deprecated: Boolean(typeDef.deprecated),
    typeName: "JsonotronRuntimeType",
    value: stringifyJRuntimeType({
      name: `${typeDef.system}${capitalizeFirstLetter(typeDef.name)}Array`,
      underlyingType: "array",
      validator: `validate${capitalizeFirstLetter(typeDef.system)}${
        capitalizeFirstLetter(typeDef.name)
      }Array`,
      schema: {
        type: "array",
        description: generateJsonSchemaDescriptionText(
          `An array of ${typeDef.system}${
            capitalizeFirstLetter(typeDef.name)
          } types.`,
          typeDef.deprecated || null,
        ),
        deprecated: typeDef.deprecated ? true : undefined,
        items: {
          $ref: `${componentSchemasPath}${typeDef.system}${
            capitalizeFirstLetter(typeDef.name)
          }`,
        },
      },
      referencedSchemaTypes: [
        `${typeDef.system}${capitalizeFirstLetter(typeDef.name)}`,
      ],
    }),
  };
}
