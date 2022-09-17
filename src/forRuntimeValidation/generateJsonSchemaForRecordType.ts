import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter, resolveJsonotronType } from "../utils/index.ts";
import { generateJsonSchemaForRecordTypeProperty } from "./generateJsonSchemaForRecordTypeProperty.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Returns a JSON schema for the record type.
 * @param recordType A Jsonotron record type.
 * @param types An array of Jsonotron types that might be referenced
 * by the properties of the given record type def.
 * @param componentSchemasPath The path to the component schemas.
 */
export function generateJsonSchemaForRecordType(
  recordType: RecordTypeDef<string>,
  types: JsonotronTypeDef[],
  componentSchemasPath?: string,
): TypescriptTreeConstDeclaration {
  const objectProperties: Record<string, unknown> = {};

  for (const recordProp of recordType.properties) {
    const recordPropType = resolveJsonotronType(recordProp.propertyType, types);

    if (recordPropType) {
      if (recordProp.isArray) {
        objectProperties[recordProp.name] = {
          type: "array",
          description: generateJsonSchemaDescriptionText(
            recordProp.summary,
            recordProp.deprecated,
          ),
          deprecated: Boolean(recordProp.deprecated),
          items: generateJsonSchemaForRecordTypeProperty(
            recordProp.summary,
            recordProp.deprecated,
            recordPropType,
            Boolean(recordProp.isNullable),
            false,
            componentSchemasPath,
          ),
        };
      } else {
        objectProperties[recordProp.name] =
          generateJsonSchemaForRecordTypeProperty(
            recordProp.summary,
            recordProp.deprecated,
            recordPropType,
            Boolean(recordProp.isNullable),
            true,
            componentSchemasPath,
          );
      }
    }
  }

  // OpenApi expects the required property of JSON schemas to have at least
  // one element, otherwise it should be omitted.
  const requiredPropertyNames = recordType.properties
    .filter((p) => p.isRequired)
    .map((p) => p.name);

  return {
    name: `${recordType.system}${capitalizeFirstLetter(recordType.name)}Schema`,
    comment:
      `The JSON schema for the ${recordType.system}/${recordType.name} type.`,
    exported: true,
    deprecated: Boolean(recordType.deprecated),
    value: "`" + JSON.stringify({
      type: "object",
      description: generateJsonSchemaDescriptionText(
        recordType.summary,
        recordType.deprecated,
      ),
      properties: objectProperties,
      required: requiredPropertyNames.length > 0
        ? requiredPropertyNames
        : undefined,
    }) + "`",
  };
}
