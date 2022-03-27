import { StringTypeDef, TypeDefValidationError } from "../interfaces/index.ts";
import { isValidRegex } from "../utils/index.ts";
import {
  createValidationFunction,
  generateStringTypeValidation,
} from "../codegenValidationClauses/index.ts";

export function validateStringTypeDef(
  def: StringTypeDef,
  errors: TypeDefValidationError[],
) {
  if (
    typeof def.minimumLength === "number" &&
    def.minimumLength > def.maximumLength
  ) {
    errors.push({
      type: `${def.system}/${def.name}`,
      kind: "minimumMaximumInverted",
      msg:
        "Minimum length, if specified, must be less than or equal to maximum length.",
    });
  }

  if (typeof def.regex === "string" && !isValidRegex(def.regex)) {
    errors.push({
      type: `${def.system}/${def.name}`,
      kind: "invalidRegexExpression",
      msg: `Regex expression ${def.regex} could not be parsed.`,
    });
  }

  const fnBody = generateStringTypeValidation({
    def,
    valueDisplayPath: "value",
    valuePath: "value",
  });

  const fn = createValidationFunction(fnBody);

  if (Array.isArray(def.validTestCases)) {
    for (
      let testCaseNo = 0;
      testCaseNo < def.validTestCases.length;
      testCaseNo++
    ) {
      const testCase = def.validTestCases[testCaseNo];
      const testCaseErrors = fn(testCase.value);

      if (testCaseErrors.length > 0) {
        errors.push({
          type: `${def.system}/${def.name}`,
          kind: "validTestCaseRejected",
          msg: `Valid test case ${testCaseNo} was rejected.`,
          errors: testCaseErrors,
        });
      }
    }
  }

  if (Array.isArray(def.invalidTestCases)) {
    for (
      let testCaseNo = 0;
      testCaseNo < def.invalidTestCases.length;
      testCaseNo++
    ) {
      const invalidTestCase = def.invalidTestCases[testCaseNo];
      const invalidTestCaseErrors = fn(invalidTestCase.value);

      if (invalidTestCaseErrors.length === 0) {
        errors.push({
          type: `${def.system}/${def.name}`,
          kind: "invalidTestCaseAccepted",
          msg: `Invalid test case ${testCaseNo} was accepted but should fail.`,
        });
      }
    }
  }
}
