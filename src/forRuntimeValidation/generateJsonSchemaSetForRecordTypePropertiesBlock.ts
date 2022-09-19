import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { resolveJsonotronType } from "../utils/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";
import { generateJsonSchemaForRecordTypeProperty } from "./generateJsonSchemaForRecordTypeProperty.ts";

export function generateJsonSchemaSetForRecordTypePropertiesBlock(
  recordType: RecordTypeDef<string>,
  types: JsonotronTypeDef[],
  componentSchemasPath?: string,
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
