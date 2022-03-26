/**
 * A parameter that can be passed to a service operation
 * as part of the query.
 */
export interface ServicePathOperationParameter {
  /**
   * The name of the parameter.
   */
  name: string;

  /**
   * The fully-qualified name of the type, e.g. std/positiveInteger.
   */
  type: string;
}
