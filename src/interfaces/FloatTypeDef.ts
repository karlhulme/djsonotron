import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";

/**
 * Represents a float definition.
 */
export interface FloatTypeDef extends JsonotronTypeDef {
  /**
   * Tags the type as a float.
   */
  kind: "float";

  /**
   * Specifies the minimum value of the float.
   */
  minimum: number;

  /**
   * Specifies whether the minimum value should be treated as an exclusive value.
   */
  isMinimumExclusive?: boolean;

  /**
   * Specifies the maximum value of the float.
   */
  maximum: number;

  /**
   * Specifies whether the maximum value should be treated as an exclusive value.
   */
  isMaximumExclusive?: boolean;
}
