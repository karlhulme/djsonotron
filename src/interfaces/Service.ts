import { ServiceInfo } from "./ServiceInfo.ts";
import { ServiceServer } from "./ServiceServer.ts";
import { ServicePath } from "./ServicePath.ts";

/**
 * Defines an API.
 */
export interface Service {
  /**
   * The top-level information about the API.
   */
  info: ServiceInfo;

  /**
   * An array of server objects.
   */
  servers?: ServiceServer[];

  /**
   * An array of service paths.
   */
  paths: ServicePath[];
}
