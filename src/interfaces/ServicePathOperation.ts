import { ServicePathOperationParameter } from "./ServicePathOperationParameter.ts";

/**
 * Describes an operation that can be invoked on a service path.
 */
export interface ServicePathOperation {
  /**
   * Describes the operation.
   */
  summary: string;

  /**
   * The name of the operation that can be used in code.
   */
  operationName: string;

  /**
   * The fully-qualified type of the request.
   */
  requestBodyType?: string;

  /**
   * An array of the operation parameters.
   */
  requestParameters?: ServicePathOperationParameter[];

  /**
   * The fully-qualified type of the response if successful.
   */
  responseBodyType?: string;
}
