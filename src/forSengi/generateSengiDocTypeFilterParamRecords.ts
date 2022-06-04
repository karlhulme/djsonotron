import { RecordTypeDef } from "../interfaces/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

export function generateSengiDocTypeFilterParamRecords(
  system: string,
  seedDocType: SengiSeedDocType,
) {
  const filterRecords: RecordTypeDef[] = [];

  for (const filter of seedDocType.filters) {
    filterRecords.push({
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

  return filterRecords;
}
