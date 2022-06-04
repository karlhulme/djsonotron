/**
 * Represents an operation for a seed doc type.
 */
export interface SengiSeedDocTypeOperation {
  /**
   * The name of the operation.
   */
  name: string;

  /**
   * The summary that describes the operation.
   */
  summary: string;

  /**
   * The fully qualified type of the parameters record object.
   */
  parametersType: string;
}
