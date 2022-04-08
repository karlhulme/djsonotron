/**
 * Represents a paraneter within a path such as /path/{id:std/uuid}/more
 */
export interface ServicePathParameter {
  /**
   * The name of the parameter.
   */
  name: string;

  /**
   * The type of the parameter.
   */
  type: string;
}
