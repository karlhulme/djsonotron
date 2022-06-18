import { ServicePathOperationCookie } from "./ServicePathOperationCookie.ts";
import { ServicePathOperationHeader } from "./ServicePathOperationHeader.ts";
import { ServicePathOperationResponseHeader } from "./ServicePathOperationResponseHeader.ts";
import { ServicePathOperationQueryParam } from "./ServicePathOperationQueryParam.ts";

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
   * An array of headers that can be passed with the request.
   */
  requestHeaders?: ServicePathOperationHeader[];

  /**
   * An array of cookies that can be passed with the request.
   */
  requestCookies?: ServicePathOperationCookie[];

  /**
   * An array of query parameters.
   */
  requestQueryParams?: ServicePathOperationQueryParam[];

  /**
   * The fully-qualified type of the request body.
   * This will typically be supplied for POST and PUT requests but
   * undefined for GET requests.
   */
  requestBodyType?: string;

  /**
   * If this property is true, then the request body is
   * expected to be an array of the specified requestBodyType values.
   */
  requestBodyTypeArray?: boolean;

  /**
   * An array of headers that may be returned.  This may include
   * a Set-Cookie header if a cookie is to be set on the caller.
   */
  responseHeaders?: ServicePathOperationResponseHeader[];

  /**
   * The fully-qualified type of the response if successful.
   */
  responseBodyType?: string;

  /**
   * If this property is true, then the response body will
   * be an array of the specified responseBodyType values.
   */
  responseBodyTypeArray?: boolean;

  /**
   * The code that the service will return if the call is successful.
   * We only support one success code, allowing callers to always
   * deserialise a successful result in the same way.  An operation
   * can use response headers to describe minor variations in the
   * handling of the request.
   */
  responseSuccessCode: number;
}
