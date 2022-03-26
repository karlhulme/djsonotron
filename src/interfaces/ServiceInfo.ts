/**
 * Represents top-level information about the API.
 */
export interface ServiceInfo {
  /**
   * The title of the API.
   */
  title: string;

  /**
   * The version of the API.
   */
  version: string;

  /**
   * A description of the API.
   */
  description?: string;
}
