import { RecordTypeDefProperty } from "../interfaces/index.ts";
import { SengiSeedDocTypeFilter } from "./SengiSeedDocTypeFilter.ts";

/**
 * Defines the properties of a document that can be
 * expanded into to a full Sengi DocType.
 */
export interface SengiSeedDocType {
  /**
   * The singular name of the doc type.
   */
  name: string;

  /**
   * The plural name of the doc type.
   */
  pluralName: string;

  /**
   * The singular title of the doc type.
   */
  title: string;

  /**
   * The plural title of the doc type.
   */
  pluralTitle: string;

  /**
   * The summary that describes the doc type.
   */
  summary: string;

  /**
   * An array of properties that make up the doc type,
   * excluding the Sengi standard fields.
   */
  properties: RecordTypeDefProperty[];

  /**
   * An array of filters that are available when querying
   * for records of this doc type.
   */
  filters: SengiSeedDocTypeFilter[];
}
