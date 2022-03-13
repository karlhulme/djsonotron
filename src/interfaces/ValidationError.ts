/**
 * Describes a validation error.
 */
export interface ValidationError {
  /**
   * The dotted path to the property that failed validation.
   * This should by the display path, whereby any array indices
   * have been resolved to a specific element where the validation
   * error occurred.
   */
  valuePath: string;

  /**
   * A message describing the failure.
   */
  msg: string;

  /**
   * The system for the type definition that described
   * the validation that failed.
   */
  typeSystem: string;

  /**
   * The name of the type definition that described
   * the validation that failed.
   */
  typeName: string;
}
