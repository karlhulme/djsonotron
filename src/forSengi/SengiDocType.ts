import { SengiDocTypeProperty } from "./SengiDocTypeProperty.ts";

/**
 * Defines the properties of a Sengi document.
 */
export interface SengiDocType {
  /**
   * The singular name of the doc type.
   */
  name: string;

  /**
   * The plural name of the doc type.
   */
  pluralName: string;

  /**
   * The summary that describes the doc type.
   */
  summary: string;

  /**
   * If true, all the documents of this type should be stored
   * in a single partition called "_central".
   */
  useSinglePartition?: boolean;

  /**
   * An array of properties that make up the doc type,
   * excluding the Sengi standard fields.
   */
  properties: SengiDocTypeProperty[];

  /**
   * If populated, this value explains why the doc type was deprecated
   * and/or which doc type to use instead.
   */
  deprecated?: string;
}
