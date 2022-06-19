/**
 * Represents a parameter supplied as part of invoking an operation.
 */
export interface ServicePathOperationParam {
  /**
   * The name of the parameter.
   * This is used for code generation.
   */
  name: string;

  /**
   * A description of the purpose of the parameter.
   */
  summary: string;

  /**
   * A value that indicates if this parameter may be null.
   */
  isNullable?: boolean;

  /**
   * A value that indicates if this parameter must be supplied.
   */
  isRequired?: boolean;

  /**
   * If populated, this field indicates that the parameter has been
   * deprecated and the value will describe what to do instead.
   */
  deprecation?: string;

  /**
   * The fully qualified name of the type of value that should
   * be supplied in the parameter.
   */
  paramType: string;
}
