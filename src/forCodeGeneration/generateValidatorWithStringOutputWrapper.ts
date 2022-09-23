import { TypescriptTreeFunction } from "../../deps.ts";

/**
 * Generates a function that wraps a validator converting any errors to a string.
 */
export function generateValidatorWithStringOutputWrapper(): TypescriptTreeFunction {
  return {
    name: "validateErrorsToString",
    comment:
      "Returns a function that takes a value and validates it using the given validator. If said validator yields one or more validation errors, then the validation errors are stringified and returned.  If the value is valid, then the function does not return a value.",
    params: [{
      name: "validator",
      typeName: "(value: any, valueDisplayPath: string) => ValidationError[]",
      comment: "The validator to be wrapped.",
    }],
    returnType: "(value: unknown) => string | void",
    exported: true,
    lines: `
      return function (innerValue: unknown): string | void {
        const errors = validator(innerValue, "value");
  
        if (errors.length > 0) {
          return JSON.stringify(errors, null, 2);
        }
      }
    `,
  };
}
