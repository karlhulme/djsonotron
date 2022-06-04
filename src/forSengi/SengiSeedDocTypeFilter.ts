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
   * An array of parameter fields.
   */
  parameters: SengiSeedDocTypeFilterParameter[];
}
