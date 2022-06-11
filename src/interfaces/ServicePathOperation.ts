/**
 * Describes an operation that can be invoked on a service path.
 */
export interface ServicePathOperation {
  /**
   * Describes the operation.
   */
  summary: string;

  /**
   * If populated, this field indicates that the operation is
   * deprecated and provides information about end-points to
   * use instead.
   */
  deprecation?: string;

  /**
   * The name of the operation that can be used in code.
   */
  operationName: string;

  /**
   * An array of tags assigned to the service path.
   */
  tags: string[];

  /**
   * The fully-qualified type of the request body.
   * This will typically be supplied for POST and PUT requests but
   * undefined for GET requests.
   */
  requestBodyType?: string;

  /**
   * The fully-qualified type that describes the operations
   * query parameters.
   * This may be defined for GET requests but will typically be
   * undefined for POST and PUT requests.
   */
  requestQueryType?: string;

  /**
   * The fully-qualified type of the response if successful.
   */
  responseBodyType?: string;

  /**
   * The code that the service will return if the call is successful.
   * We only support one success code, allowing callers to always
   * deserialise a successful result in the same way.  An operation
   * can use response headers to describe minor variations in the
   * handling of the request.
   */
  responseSuccessCode: number;
}
