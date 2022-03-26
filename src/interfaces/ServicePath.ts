import { ServicePathOperation } from "./ServicePathOperation.ts";

/**
 * A path on the service.
 */
export interface ServicePath {
  /**
   * The service path.  It must begin with a forward slash
   * and any variables should be enclosed in curly braces,
   * e.g. /pets/{petId}
   */
  path: string;

  /**
   * Describes the resource available at the path.
   */
  summary: string;

  /**
   * Full description of the resources available at the path.
   */
  description?: string;

  /**
   * The GET operation.
   */
  get?: ServicePathOperation;

  /**
   * The PUT operation.
   */
  put?: ServicePathOperation;

  /**
   * The POST operation.
   */
  post?: ServicePathOperation;

  /**
   * The DELETE operation.
   */
  delete?: ServicePathOperation;

  /**
   * The PATCH operation.
   */
  patch?: ServicePathOperation;
}
