/**
 * Represents a cookie supplied as part of invoking an operation.
 */
export interface ServicePathOperationCookie {
  /**
   * The name of the cookie.
   * This is used for code generation.
   */
  name: string;

  /**
   * A description of the purpose of the cookie.
   */
  summary: string;

  /**
   * A value that indicates if this cookie must be supplied.
   */
  required?: boolean;

  /**
   * If populated, this field indicates that the cookie has been
   * deprecated and will the value will describe what to do instead.
   */
  deprecation?: string;

  /**
   * The fully qualified name of the type of value that should
   * be supplied in the cookie.
   */
  cookieType: string;
}
