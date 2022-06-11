/**
 * Represents a header returned with the response to invoking
 * an operation.
 */
export interface ServicePathOperationResponseHeader {
  /**
   * The name of the header.
   * This is used for code generation.
   */
  name: string;

  /**
   * A description of the usage of the header.
   */
  summary: string;

  /**
   * The name of the header as provided in an HTTP response.
   */
  httpName: string;

  /**
   * A value that indicates if this header will always be supplied.
   */
  guaranteed?: boolean;

  /**
   * If populated, this field indicates that the header has been
   * deprecated and which header to use instead.
   */
  deprecation?: string;

  /**
   * The fully qualified name of the type of value that will
   * be supplied in the header.
   */
  headerType: string;
}
