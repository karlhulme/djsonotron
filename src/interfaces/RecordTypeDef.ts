import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";
import { RecordTypeDefProperty } from "./RecordTypeDefProperty.ts";
import { TestCase } from "./TestCase.ts";

/**
 * Represents a record type definition.
 */
export interface RecordTypeDef extends JsonotronTypeDef {
  /**
   * An array of properties that can appear in this record.
   */
  properties: RecordTypeDefProperty[];

  /**
   * Indicates which of the properties on this record type are mandatory.
   */
  required?: string[];

  /**
   * An array of values that can be represented by this type.
   * Some of these cases may also serve as example usages of the type.
   */
  validTestCases?: TestCase<unknown>[];

  /**
   * An array of values that cannot be represented by this type.
   */
  invalidTestCases?: TestCase<unknown>[];
}
