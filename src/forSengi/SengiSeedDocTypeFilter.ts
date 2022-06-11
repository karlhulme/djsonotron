import { SengiSeedDocTypeFilterParameter } from "./SengiSeedDocTypeFilterParameter.ts";

/**
 * Represents a filter for a seed doc type.
 */
export interface SengiSeedDocTypeFilter {
  /**
   * The name of the filter, typically of the form 'by____'.
   */
  name: string;

  /**
   * The summary that describes the filter.
   */
  summary: string;

  /**
   * If populated, this filter should no longer be used, and the property
   * will describe what to do instead.
   */
  deprecation?: string;

  /**
   * An array of parameter fields.
   */
  parameters: SengiSeedDocTypeFilterParameter[];
}
