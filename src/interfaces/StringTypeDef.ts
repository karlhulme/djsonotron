import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";
import { TestCase } from "./TestCase.ts";

/**
 * Represents a string definition.
 */
export interface StringTypeDef extends JsonotronTypeDef {
  /**
   * Tags the type as a string.
   */
  kind: "string";

  /**
   * Specifies the regular expression string that can be used
   * to validate the string.
   */
  regex?: string;

  /**
   * Specifies the minimum length of the string.
   */
  minimumLength?: number;

  /**
   * Specifies the maximum length of the string.
   */
  maximumLength: number;

  /**
   * An array of values that can be represented by this type.
   */
  validTestCases?: TestCase<string>[];

  /**
   * An array of values that cannot be represented by this type.
   */
  invalidTestCases?: TestCase<string>[];
}
