import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";

/**
 * Represents an integer definition.
 */
export interface IntTypeDef extends JsonotronTypeDef {
  /**
   * Tags the type as an int.
   */
  kind: "int";

  /**
   * Specifies the minimum value of the integer.
   */
  minimum: number;

  /**
   * Specifies the maximum value of the integer.
   */
  maximum: number;
}
