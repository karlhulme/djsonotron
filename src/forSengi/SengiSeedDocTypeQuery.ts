import { SengiSeedDocTypeQueryParameter } from "./SengiSeedDocTypeQueryParameter.ts";

/**
 * Represents a query for a seed doc type.
 */
export interface SengiSeedDocTypeQuery {
  /**
   * The name of the query.
   */
  name: string;

  /**
   * The summary that describes the operation.
   */
  summary: string;

  /**
   * If populated, this query should no longer be used, and the property
   * will describe what to do instead.
   */
  deprecation?: string;

  /**
   * An array of parameter fields.
   */
  parameters: SengiSeedDocTypeQueryParameter[];

  /**
   * The fully qualified type of the result type.
   */
  resultType: string;
}
