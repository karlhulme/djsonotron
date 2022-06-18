/**
 * Represents a query parameter supplied in the url of a request.
 */
export interface ServicePathOperationQueryParam {
  /**
   * The name of the query parameter.
   * This is used for code generation.
   */
  name: string;

  /**
   * A description of the purpose of the query parameter.
   */
  summary: string;

  /**
   * A value that indicates if this query parameter must be supplied.
   */
  isRequired?: boolean;

  /**
   * If populated, this field indicates that the query parameter has been
   * deprecated and the value will describe what to do instead.
   */
  deprecation?: string;

  /**
   * The fully qualified name of the type of value that should
   * be supplied in the query parameter.
   */
  paramType: string;
}
