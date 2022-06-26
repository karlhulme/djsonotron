import {
  OpenApiSpecComponentSchema,
  OpenApiSpecComponentSchemaProperty,
} from "../../deps.ts";
import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter, resolveJsonotronType } from "../utils/index.ts";
import { generateServicePathJsonSchemaForJsonotronTypeDef } from "./generateServicePathJsonSchemaForJsonotronTypeDef.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateJsonSchemaForRecordType(
  recordType: RecordTypeDef,
  types: JsonotronTypeDef[],
): OpenApiSpecComponentSchema {
  const objectProperties: Record<string, OpenApiSpecComponentSchemaProperty> =
    {};

  for (const recordProp of recordType.properties) {
    const recordPropType = resolveJsonotronType(recordProp.propertyType, types);

    if (recordPropType) {
      if (recordProp.isArray) {
        objectProperties[recordProp.name] = {
          type: "array",
          title: `An array of ${capitalizeFirstLetter(recordPropType.system)}${
            capitalizeFirstLetter(recordPropType.name)
          } values.`,
          description: generateDescriptionText(
            recordProp.summary,
            recordProp.deprecated,
          ),
          deprecated: recordProp.deprecated ? true : undefined,
          items: generateServicePathJsonSchemaForJsonotronTypeDef(
            recordProp.summary,
            recordProp.deprecated,
            recordPropType,
            Boolean(recordProp.isNullable),
            false,
          ),
        };
      } else {
        objectProperties[recordProp.name] =
          generateServicePathJsonSchemaForJsonotronTypeDef(
            recordProp.summary,
            recordProp.deprecated,
            recordPropType,
            Boolean(recordProp.isNullable),
            true,
          );
      }
    }
  }

  // OpenApi expects the required property to have at least
  // one element, otherwise it should be omitted.
  const requiredPropertyNames = recordType.properties
    .filter((p) => p.isRequired)
    .map((p) => p.name);

  return {
    type: "object",
    properties: objectProperties,
    required: requiredPropertyNames.length > 0
      ? requiredPropertyNames
      : undefined,
  };
}
