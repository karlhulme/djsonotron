/**
 * Represents a constructor for a seed doc type.
 */
export interface SengiSeedDocTypeConstructor {
  /**
   * The name of the constructor, typically of the form 'with____'
   */
  name: string;

  /**
   * The summary that describes the constructor.
   */
  summary: string;

  /**
   * The fully qualified type of the parameters record object.
   */
  parametersType: string;
}
