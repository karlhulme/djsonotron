import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { resolveJsonotronType } from "../utils/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";
import { generateJsonSchemaForRecordTypeProperty } from "./generateJsonSchemaForRecordTypeProperty.ts";

/**
 * Generates a record where each key is a record property and the
 * corresponding value is a json schema that validates said property.
 * @param recordType A record type.
 * @param types An array of jsonotron types that the record might
 * reference in the property declarations.
 * @param componentSchemasPath The path to the component schemas,
 * defaults to #/components/schemas which is the path found in OpenApi
 * specifications.
 * @returns
 */
export function generateJsonSchemaSetForRecordTypePropertiesBlock(
  recordType: RecordTypeDef<string>,
  types: JsonotronTypeDef[],
  componentSchemasPath: string,
) {
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

  return objectProperties;
}
