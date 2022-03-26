/**
 * An object representing a server.
 */
export interface ServiceServer {
  /**
   * The url where the service is hosted.
   */
  url: string;

  /**
   * An optional description of the service.
   */
  description?: string;
}
