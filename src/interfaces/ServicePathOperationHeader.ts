/**
 * Represents a header supplied as part of invoking an operation.
 */
export interface ServicePathOperationHeader {
  /**
   * The name of the header.
   * This is used for code generation.
   */
  name: string;

  /**
   * A description of the purpose of the header.
   */
  summary: string;

  /**
   * The name of the header as specified in HTTP calls.
   */
  httpName: string;

  /**
   * A value that indicates if this header must be supplied.
   */
  isRequired?: boolean;

  /**
   * If populated, this field indicates that the header has been
   * deprecated and will the value will describe what to do instead.
   */
  deprecation?: string;

  /**
   * The fully qualified name of the type of value that should
   * be supplied in the header.
   */
  headerType: string;
}
