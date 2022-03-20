import { ValidationError } from "./ValidationError.ts";

export type TypeDefValidationErrorKind =
  | "unrecognisedPropertyType"
  | "validTestCaseRejected"
  | "invalidTestCaseAccepted"
  | "minimumMaximumInverted"
  | "invalidRegexExpression";

/**
 * Describes a validation error for a Jsonotron type.
 */
export interface TypeDefValidationError {
  /**
   * The fully qualified name of the type, e.g. std/positiveInteger.
   */
  type: string;

  /**
   * The kind of error described by this object.  This property determines
   * which of the optional fields will be populated.
   */
  kind: TypeDefValidationErrorKind;

  /**
   * A description of the validation issue.
   */
  msg: string;

  /**
   * Associated validation errors for test cases.
   */
  errors?: ValidationError[];
}
