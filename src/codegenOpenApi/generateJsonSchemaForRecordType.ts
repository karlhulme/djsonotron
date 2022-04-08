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
      objectProperties[recordProp.name] =
        determineJsonSchemaTypeForJsonotronType(recordPropType);
    }
  }

  return {
    type: "object",
    properties: objectProperties,
    required: recordType.properties
      .filter((p) => p.isRequired)
      .map((p) => p.name),
  };
}
