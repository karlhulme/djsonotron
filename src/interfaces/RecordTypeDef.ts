import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";
import { RecordTypeDefProperty } from "./RecordTypeDefProperty.ts";
import { TestCase } from "./TestCase.ts";

/**
 * Represents a record type definition.
 */
export interface RecordTypeDef<JsonotronTypeNames extends string>
  extends JsonotronTypeDef {
  /**
   * Tags the type as a record.
   */
  kind: "record";

  /**
   * An array of properties that can appear in this record.
   */
  properties: RecordTypeDefProperty<JsonotronTypeNames>[];

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
