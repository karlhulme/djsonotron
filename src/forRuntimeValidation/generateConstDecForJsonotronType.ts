import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import {
  capitalizeFirstLetter,
  getJsonSchemaTypeForJsonotronTypeKind,
  stringifyJRuntimeType,
} from "../utils/index.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a const declaration with a validator and JSON schema
 * for the given jsonotron type.
 * This function works for all Jsonotron types but there are specialised
 * methods for enum and record types.
 * @param typeDef A jsonotron type.
 */
export function generateConstDecForJsonotronType(
  typeDef: JsonotronTypeDef,
): TypescriptTreeConstDeclaration {
  return {
    name: `${typeDef.system}${capitalizeFirstLetter(typeDef.name)}Type`,
    comment:
      `The schema and validator for the ${typeDef.system}/${typeDef.name} type.`,
    exported: true,
    deprecated: Boolean(typeDef.deprecated),
    typeName: "JsonotronRuntimeType",
    value: stringifyJRuntimeType({
      name: `${typeDef.system}${capitalizeFirstLetter(typeDef.name)}`,
      underlyingType: getJsonSchemaTypeForJsonotronTypeKind(typeDef.kind),
      validator: `validate${capitalizeFirstLetter(typeDef.system)}${
        capitalizeFirstLetter(typeDef.name)
      }`,
      schema: {
        type: getJsonSchemaTypeForJsonotronTypeKind(typeDef.kind),
        description: generateJsonSchemaDescriptionText(
          typeDef.summary,
          typeDef.deprecated,
        ),
        deprecated: typeDef.deprecated ? true : undefined,
      },
      referencedRuntimeTypes: [],
    }),
  };
}
