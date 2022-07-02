import { RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
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
      name: `${seedDocType.name}${capitalizeFirstLetter(filter.name)}Filter`,
      pluralName: `${seedDocType.name}${
        capitalizeFirstLetter(filter.name)
      }Filters`,
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

  for (const ctor of seedDocType.constructors) {
    records.push({
      kind: "record",
      system: system,
      name: `${seedDocType.name}${capitalizeFirstLetter(ctor.name)}Params`,
      pluralName: `${seedDocType.name}${
        capitalizeFirstLetter(ctor.name)
      }ParamsRecords`,
      summary: `The parameters for the ${ctor.name} constructor.`,
      properties: ctor.parameters.map((param) => ({
        name: param.name,
        summary: param.summary,
        propertyType: param.propertyType,
        isRequired: param.isRequired,
        deprecated: param.deprecated,
      })),
    });
  }

  for (const op of seedDocType.operations) {
    records.push({
      kind: "record",
      system: system,
      name: `${seedDocType.name}${capitalizeFirstLetter(op.name)}Params`,
      pluralName: `${seedDocType.name}${
        capitalizeFirstLetter(op.name)
      }ParamsRecords`,
      summary: `The parameters for the ${op.name} operation.`,
      properties: op.parameters.map((param) => ({
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
      name: `${seedDocType.name}${capitalizeFirstLetter(query.name)}Query`,
      pluralName: `${seedDocType.name}${
        capitalizeFirstLetter(query.name)
      }Queries`,
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
