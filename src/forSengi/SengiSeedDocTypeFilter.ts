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
   * The name of the jsonotron type that describes the parameters
   * of the filter.
   */
  parametersType: string;
}
