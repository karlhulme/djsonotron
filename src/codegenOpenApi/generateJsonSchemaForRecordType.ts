import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { resolveJsonotronType } from "../utils/index.ts";
import { determineJsonSchemaTypeForJsonotronType } from "./determineJsonSchemaTypeForJsonotronType.ts";

export function generateJsonSchemaForRecordType(
  recordType: RecordTypeDef,
  types: JsonotronTypeDef[],
): Record<string, unknown> {
  const objectProperties: Record<string, unknown> = {};

  for (const recordProp of recordType.properties) {
    const recordPropType = resolveJsonotronType(recordProp.propertyType, types);

    if (recordPropType) {
      if (recordProp.isArray) {
        objectProperties[recordProp.name] = {
          type: "array",
          items: determineJsonSchemaTypeForJsonotronType(recordPropType),
        };
      } else {
        objectProperties[recordProp.name] =
          determineJsonSchemaTypeForJsonotronType(recordPropType);
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
