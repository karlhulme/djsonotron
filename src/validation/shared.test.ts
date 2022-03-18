import { AssertionError } from "../../deps.ts";
import { ValidationError } from "../interfaces/index.ts";

export function createValidationFunction(body: string) {
  const fnBody = `
  const errors = []
  ${body}
  return errors
`;

  const fn = new Function("value", fnBody);

  return fn;
}

export function assertValidationErrorMessage(
  actual: ValidationError[],
  expectedMessage: string,
  msg?: string,
): void {
  if (!Array.isArray(actual)) {
    throw new AssertionError("Test value was not an array.");
  }

  if (actual.length !== 1) {
    throw new AssertionError("Test value array did not have length of 1.");
  }

  if (typeof actual[0].msg !== "string") {
    throw new AssertionError("First error does not have msg property.");
  }

  if (!actual[0].msg.includes(expectedMessage)) {
    throw new AssertionError(
      msg ||
        `Expected msg property to include '${expectedMessage}' but received '${
          actual[0].msg
        }'`,
    );
  }
}
