import { AssertionError } from "../../deps.ts";
import { TypeDefValidationError } from "../interfaces/index.ts";

export function assertTypeDefValidationErrorFirstMessage(
  errors: TypeDefValidationError[],
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

    if (typeof error.kind !== "string") {
      throw new AssertionError(
        `Error ${errorNo} does not have kind property.`,
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
        `Expected msg property of first type def error to include '${firstMessage}' but received '${
          errors[0].msg
        }'`,
    );
  }
}
