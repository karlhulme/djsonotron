import { ServiceInfo } from "./ServiceInfo.ts";
import { ServiceServer } from "./ServiceServer.ts";

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
  servers: ServiceServer[];
}
