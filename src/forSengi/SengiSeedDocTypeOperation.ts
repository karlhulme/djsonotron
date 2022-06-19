import { SengiSeedDocTypeOperationParameter } from "./SengiSeedDocTypeOperationParameter.ts";

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
   * If populated, this operation should no longer be used, and the property
   * will describe what to do instead.
   */
  deprecation?: string;

  /**
   * The fully qualified type of the parameters record object.
   */
  parameters: SengiSeedDocTypeOperationParameter[];
}
