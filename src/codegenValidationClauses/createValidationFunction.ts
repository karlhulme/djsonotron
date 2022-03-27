import { ValidationFunction } from "../interfaces/index.ts";

/**
 * Creates a validation function using the given validation body.
 * @param body The body of a validation function.
 */
export function createValidationFunction(body: string): ValidationFunction {
  const fnBody = `
  const errors = []
  ${body}
  return errors
`;

  try {
    const fn = new Function("value", fnBody);
    return fn as ValidationFunction;
  } catch (err) {
    throw new Error(
      `Could not create validation function.\n${
        (err as Error).message
      }\n${fnBody}`,
    );
  }
}
