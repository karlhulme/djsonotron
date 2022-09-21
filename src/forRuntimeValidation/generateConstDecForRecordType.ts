import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  resolveJsonotronType,
  stringifyJRuntimeType,
} from "../utils/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";
import { generateJsonSchemaSetForRecordTypePropertiesBlock } from "./generateJsonSchemaSetForRecordTypePropertiesBlock.ts";

/**
 * Returns a const declaration with a validator and JSON schema
 * for the given record type.
 * @param recordType A Jsonotron record type.
 * @param types An array of Jsonotron types that might be referenced
 * by the properties of the given record type def.
 * @param componentSchemasPath The path to the component schemas.
 */
export function generateConstDecForRecordType(
  recordType: RecordTypeDef<string>,
  types: JsonotronTypeDef[],
  componentSchemasPath: string,
): TypescriptTreeConstDeclaration {
  const objectProperties = generateJsonSchemaSetForRecordTypePropertiesBlock(
    recordType,
    types,
    componentSchemasPath,
  );

  // OpenApi expects the required property of JSON schemas to have at least
  // one element, otherwise it should be omitted.
  const requiredPropertyNames = recordType.properties
    .filter((p) => p.isRequired)
    .map((p) => p.name);

  const referencedSchemaTypes: string[] = [];

  // Build up a list of directly referenced types.
  for (const recordProp of recordType.properties) {
    const recordPropType = resolveJsonotronType(recordProp.propertyType, types);
    const refTypeName = `${recordPropType.system}${
      capitalizeFirstLetter(recordPropType.name)
    }`;

    if (!referencedSchemaTypes.includes(refTypeName)) {
      referencedSchemaTypes.push(refTypeName);
    }
  }

  return {
    name: `${recordType.system}${capitalizeFirstLetter(recordType.name)}Type`,
    comment:
      `The JSON schema for the ${recordType.system}/${recordType.name} type.`,
    exported: true,
    deprecated: Boolean(recordType.deprecated),
    typeName: "JsonotronRuntimeType",
    value: stringifyJRuntimeType({
      name: `${recordType.system}${capitalizeFirstLetter(recordType.name)}`,
      underlyingType: "object",
      validator: `validate${capitalizeFirstLetter(recordType.system)}${
        capitalizeFirstLetter(recordType.name)
      }`,
      schema: {
        type: "object",
        description: generateJsonSchemaDescriptionText(
          recordType.summary,
          recordType.deprecated,
        ),
        properties: objectProperties,
        required: requiredPropertyNames.length > 0
          ? requiredPropertyNames
          : undefined,
      },
      referencedSchemaTypes,
    }),
  };
}
