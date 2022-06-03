import { RecordTypeDefProperty } from "../interfaces/index.ts";

/**
 * Defines the properties of a document that can be
 * expanded into to a full Sengi DocType.
 */
export interface SengiSeedDocType {
  name: string;
  pluralName: string;
  title: string;
  pluralTitle: string;
  summary: string;
  properties: RecordTypeDefProperty[];
}
