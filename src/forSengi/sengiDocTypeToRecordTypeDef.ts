import { RecordTypeDef } from "../interfaces/index.ts";
import { SengiDocType } from "./SengiDocType.ts";
import { createSengiStandardProperties } from "./createSengiStandardProperties.ts";
/**
 * Converts the given sengi doc type to a record type definition.
 * @param docType A sengi document type.
 */
export function sengiDocTypetoRecordTypeDef(
  docType: SengiDocType,
): RecordTypeDef {
  return {
    kind: "record",
    system: "db",
    name: docType.name,
    summary: docType.summary,
    deprecated: docType.deprecated,
    properties: [
      ...createSengiStandardProperties(docType.name),
      ...docType.properties.map((property) => ({
        name: property.name,
        summary: property.summary,
        propertyType: property.propertyType,
        isArray: Boolean(property.isArray),
        isNullable: false,
        isRequired: property.isRequired,
        deprecated: property.deprecated,
      })),
    ],
  };
}
