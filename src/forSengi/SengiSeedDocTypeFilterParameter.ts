/**
 * Represents a filter parameter.
 */
export interface SengiSeedDocTypeFilterParameter {
  /**
   * The name of the parameter.
   */
  name: string;

  /**
   * The summary description of the parameter.
   */
  summary: string;

  /**
   * The fully qualified type of the parameter.
   */
  propertyType: string;

  /**
   * True if the field must be supplied, otherwise false.
   */
  isRequired?: boolean;

  /**
   * If populated, this value will describe the field to use
   * instead of this one.
   */
  isDeprecated?: string;
}
