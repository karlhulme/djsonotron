/**
 * Returns the shared types, enums and/or interfaces
 * that are used by the typescript definitions.
 */
export function generateTypescriptSharedTypes() {
  return `
// deno-lint-ignore-file no-explicit-any
// This file was automatically generated.

/**
 * Describes a validation error.
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
`;
}
