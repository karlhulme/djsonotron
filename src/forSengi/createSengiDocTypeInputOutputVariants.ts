import { RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";
import {
  createDocCreatedByMillisecondsSinceEpoch,
  createDocCreatedByUserId,
  createDocLastUpdatedByMillisecondsSinceEpoch,
  createDocLastUpdatedByUserId,
  createDocOpIdsProperty,
  createDocTypeProperty,
  createDocVersionProperty,
  createIdProperty,
} from "./sengiStandardPropCreators.ts";

/**
 * Expands the given seedDocType into a set of variants for selecting, creating,
 * patching and replacing documents.
 * @param system The name of the system to which docType variants will be assigned.
 * @param seedDocType A seed docType that can be expanded.
 * @param statements An array of Typescript statements that will be populated
 * by this function.
 * @param exportedTypes An array of the Typescript types that are created by
 * this function.
 */
export function generateSengiDocTypeInputOutputVariants(
  system: string,
  seedDocType: SengiSeedDocType,
  statements: string[],
  exportedTypes: string[],
) {
  const doc: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}Record`,
    summary: seedDocType.summary,
    properties: [
      createIdProperty(false),
      createDocTypeProperty(false, seedDocType.name),
      createDocOpIdsProperty(false),
      createDocVersionProperty(false),
      createDocCreatedByUserId(false),
      createDocCreatedByMillisecondsSinceEpoch(false),
      createDocLastUpdatedByUserId(false),
      createDocLastUpdatedByMillisecondsSinceEpoch(false),
      ...seedDocType.properties.map((prop) => ({
        ...prop,
        isRequired: false,
      })),
    ],
  };

  statements.push(
    `export const ${seedDocType.name}: RecordTypeDef = ${
      JSON.stringify(doc, null, 2)
    }`,
  );
  exportedTypes.push(seedDocType.name);

  const docTemplate: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `new${capitalizeFirstLetter(seedDocType.name)}Template`,
    summary: `The template to create a new ${seedDocType.name}.`,
    properties: [
      ...seedDocType.properties,
    ],
  };

  statements.push(
    `export const new${
      capitalizeFirstLetter(seedDocType.name)
    }Template: RecordTypeDef = ${JSON.stringify(docTemplate, null, 2)}`,
  );
  exportedTypes.push(`new${capitalizeFirstLetter(seedDocType.name)}Template`);

  const docPatch: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}Patch`,
    summary: `A patch to update an exising ${seedDocType.name} record.`,
    properties: [
      ...seedDocType.properties.map((prop) => ({
        ...prop,
        isRequired: false,
      })),
    ],
  };

  statements.push(
    `export const ${seedDocType.name}Patch: RecordTypeDef = ${
      JSON.stringify(docPatch, null, 2)
    }`,
  );
  exportedTypes.push(`${seedDocType.name}Patch`);

  const docReplacement: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}Replacement`,
    summary: `A document to replace an existing ${seedDocType.name} record.`,
    properties: [
      createIdProperty(true),
      createDocTypeProperty(true, seedDocType.name),
      ...seedDocType.properties,
    ],
  };

  statements.push(
    `export const ${seedDocType.name}Replacement: RecordTypeDef = ${
      JSON.stringify(docReplacement, null, 2)
    }`,
  );
  exportedTypes.push(`${seedDocType.name}Replacement`);
}
