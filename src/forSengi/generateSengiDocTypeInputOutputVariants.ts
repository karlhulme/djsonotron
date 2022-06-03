import { RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";
import {
  generateDocCreatedByMillisecondsSinceEpoch,
  generateDocCreatedByUserId,
  generateDocLastUpdatedByMillisecondsSinceEpoch,
  generateDocLastUpdatedByUserId,
  generateDocOpIdsProperty,
  generateDocTypeProperty,
  generateDocVersionProperty,
  generateIdProperty,
} from "./sengiStandardPropCreators.ts";

/**
 * Expands the given seedDocType into a set of variants for selecting, creating,
 * patching and replacing documents.
 * @param system The name of the system to which docType variants will be assigned.
 * @param seedDocType A seed doc type that can be expanded.
 */
export function generateSengiDocTypeInputOutputVariants(
  system: string,
  seedDocType: SengiSeedDocType,
) {
  const docRecord: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}Record`,
    summary: seedDocType.summary,
    properties: [
      generateIdProperty(false),
      generateDocTypeProperty(false, seedDocType.name),
      generateDocOpIdsProperty(false),
      generateDocVersionProperty(false),
      generateDocCreatedByUserId(false),
      generateDocCreatedByMillisecondsSinceEpoch(false),
      generateDocLastUpdatedByUserId(false),
      generateDocLastUpdatedByMillisecondsSinceEpoch(false),
      ...seedDocType.properties.map((prop) => ({
        ...prop,
        isRequired: false,
      })),
    ],
  };

  const docTemplate: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `new${capitalizeFirstLetter(seedDocType.name)}Template`,
    summary: `The template to create a new ${seedDocType.name}.`,
    properties: [
      ...seedDocType.properties,
    ],
  };

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

  const docReplacement: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}Replacement`,
    summary: `A document to replace an existing ${seedDocType.name} record.`,
    properties: [
      generateIdProperty(true),
      generateDocTypeProperty(true, seedDocType.name),
      ...seedDocType.properties,
    ],
  };

  return [
    docRecord,
    docTemplate,
    docPatch,
    docReplacement
  ]
}
