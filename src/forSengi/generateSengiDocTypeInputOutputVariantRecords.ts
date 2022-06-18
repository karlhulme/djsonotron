import { RecordTypeDef } from "../interfaces/index.ts";
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
export function generateSengiDocTypeInputOutputVariantRecords(
  system: string,
  seedDocType: SengiSeedDocType,
) {
  // The 'Native' variant is used on the server side to ensure that documents
  // are valid as they are saved.  We require all system fields to be set
  // and all required non-system fields too.
  const doc: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}`,
    summary: seedDocType.summary,
    properties: [
      generateIdProperty(true),
      generateDocTypeProperty(true, seedDocType.name),
      generateDocOpIdsProperty(true),
      generateDocCreatedByUserId(true),
      generateDocCreatedByMillisecondsSinceEpoch(true),
      generateDocLastUpdatedByUserId(true),
      generateDocLastUpdatedByMillisecondsSinceEpoch(true),
      ...seedDocType.properties,
    ],
  };

  // The 'Record' variant is used when a record is returned to a client.
  // All of the fields are optional because the populated ones will depend
  // on which fields were requested.
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

  // The 'Template' variant is used when a new document is created
  // without an explicit constructor.  We want an id for the new doc
  // and the non-system fields where we will honour the required flags.
  const docTemplate: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}Template`,
    summary: `The template to create a new ${seedDocType.name}.`,
    properties: [
      generateIdProperty(true),
      ...seedDocType.properties,
    ],
  };

  // The 'Patch' variant is used when a document is being updated.
  // We only want the non-system fields to be supplied here, but we
  // ignore the required flags since the assumption is the document
  // is valid prior to the patch and thus any required fields should
  // have existing values.
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

  // The 'Replacement' variant is used when a document is being replaced
  // wholesale.  We require the main system fields, optionally allow
  // the time-based/tracking system fields (although Sengi can set defaults
  // automatically) and all the non-system fields with required flags.
  const docReplacement: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `${seedDocType.name}Replacement`,
    summary: `A document to replace an existing ${seedDocType.name} record.`,
    properties: [
      generateIdProperty(true),
      generateDocTypeProperty(true, seedDocType.name),
      generateDocOpIdsProperty(false),
      generateDocCreatedByUserId(false),
      generateDocCreatedByMillisecondsSinceEpoch(false),
      generateDocLastUpdatedByUserId(false),
      generateDocLastUpdatedByMillisecondsSinceEpoch(false),
      ...seedDocType.properties,
    ],
  };

  return [
    doc,
    docRecord,
    docTemplate,
    docPatch,
    docReplacement,
  ];
}
