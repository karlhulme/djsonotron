import { ValidationError } from "./ValidationError.ts";

/**
 * Describes the result of a validation.
 * If the errors property is an empty array, then no
 * validation errors occurred.
 */
export interface ValidationResult {
  /**
   * An array of the validation errors that were identified.
   */
  errors: ValidationError[];
}
