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
   * A value that indicates if this header is associated with
   * authorisation.  If this value cannot be validated then
   * a different error is raised.  (This is useful for web servers
   * that want to issue an HTTP 401 instead of a 400.)
   */
  isAuthorisationHeader?: boolean;

  /**
   * If populated, this field indicates that the header has been
   * deprecated and the value will describe what to do instead.
   */
  deprecation?: string;

  /**
   * The fully qualified name of the type of value that should
   * be supplied in the header.
   */
  headerType: string;
}
