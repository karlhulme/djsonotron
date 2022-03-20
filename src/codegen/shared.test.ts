import { AssertionError } from "../../deps.ts";
import { ValidationError } from "../interfaces/index.ts";

export function assertValidationErrorFirstMessage(
  errors: ValidationError[],
  firstMessage: string,
  msg?: string,
): void {
  if (!Array.isArray(errors)) {
    throw new AssertionError("Errors parameter was not an array.");
  }

  if (errors.length !== 1) {
    throw new AssertionError("Errors array did not have length of 1.");
  }

  for (let errorNo = 0; errorNo < errors.length; errorNo++) {
    const error = errors[errorNo];

    if (typeof error.valuePath !== "string") {
      throw new AssertionError(
        `Error ${errorNo} does not have valuePath property.`,
      );
    }

    if (typeof error.type !== "string") {
      throw new AssertionError(
        `Error ${errorNo} does not have typeSystem property.`,
      );
    }

    if (typeof error.msg !== "string") {
      throw new AssertionError(`Error ${errorNo} does not have msg property.`);
    }
  }

  if (!errors[0].msg.includes(firstMessage)) {
    throw new AssertionError(
      msg ||
        `Expected msg property of first error to include '${firstMessage}' but received '${
          errors[0].msg
        }'`,
    );
  }
}
