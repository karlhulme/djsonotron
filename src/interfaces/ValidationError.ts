/**
 * Describes a validation error.
 * This interface definition needs to be emitted by the typescript
 * generation functions as well.
 */
export interface ValidationError {
  /**
   * The fully qualified name of the type, e.g. std/positiveInteger.
   */
  type: string;

  /**
   * A message describing the failure.
   */
  msg: string;

  /**
   * The dotted path to the property that failed validation.
   * This should by the display path, whereby any array indices
   * have been resolved to a specific element where the validation
   * error occurred.
   */
  valuePath: string;

  /**
   * The value that failed validation.
   */
  value: unknown;
}
