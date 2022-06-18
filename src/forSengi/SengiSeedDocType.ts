import { RecordTypeDefProperty } from "../interfaces/index.ts";
import { SengiSeedDocTypeFilter } from "./SengiSeedDocTypeFilter.ts";
import { SengiSeedDocTypeConstructor } from "./SengiSeedDocTypeConstructor.ts";
import { SengiSeedDocTypeOperation } from "./SengiSeedDocTypeOperation.ts";
import { SengiSeedDocTypeQuery } from "./SengiSeedDocTypeQuery.ts";

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
   * If true, all the documents of this type should be stored
   * in a single partition.
   */
  useSinglePartition?: boolean;

  /**
   * If true, a byCursor filter will be added to the definition.
   */
  addFilterByCursor?: boolean;

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

  /**
   * An array of constructors that can be used to create
   * a record of this doc type.
   */
  constructors: SengiSeedDocTypeConstructor[];

  /**
   * An array of operations that can mutate a record of this
   * doc type.
   */
  operations: SengiSeedDocTypeOperation[];

  /**
   * An array of queries that can be executed against
   * a container of records of this doc type.
   */
  queries: SengiSeedDocTypeQuery[];
}
