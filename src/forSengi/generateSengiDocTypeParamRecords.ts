import { RecordTypeDef } from "../interfaces/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

export function generateSengiDocTypeParamRecords(
  system: string,
  seedDocType: SengiSeedDocType,
) {
  const records: RecordTypeDef[] = [];

  for (const filter of seedDocType.filters) {
    records.push({
      kind: "record",
      system: system,
      name: `${filter.name}Filter`,
      summary: `The parameters for the ${filter.name} filter.`,
      properties: filter.parameters.map((param) => ({
        name: param.name,
        summary: param.summary,
        propertyType: param.propertyType,
        isRequired: param.isRequired,
        deprecated: param.deprecated,
      })),
    });
  }

  for (const query of seedDocType.queries) {
    records.push({
      kind: "record",
      system: system,
      name: `${query.name}Query`,
      summary: `The parameters for the ${query.name} query.`,
      properties: query.parameters.map((param) => ({
        name: param.name,
        summary: param.summary,
        propertyType: param.propertyType,
        isRequired: param.isRequired,
        deprecated: param.deprecated,
      })),
    });
  }

  return records;
}
