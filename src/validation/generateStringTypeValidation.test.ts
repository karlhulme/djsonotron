import { assertEquals } from "../../deps.ts";
import { StringTypeDef } from "../interfaces/index.ts";
import { generateStringTypeValidation } from "./generateStringTypeValidation.ts";
import {
  assertValidationErrorFirstMessage,
  createValidationFunction,
} from "./shared.test.ts";

const simpleString: StringTypeDef = {
  kind: "string",
  system: "test",
  name: "simpleString",
  summary: "A type used for testing.",
  maximumLength: 10,
  minimumLength: 5,
  regex: "^[a-z]+$"
};

function generateStringValidationFunction(def: StringTypeDef) {
  const fnBody = generateStringTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
  });

  return createValidationFunction(fnBody);
}

Deno.test("Validate a valid string.", () => {
  const fn = generateStringValidationFunction(simpleString);
  assertEquals(fn("valid"), []);
});

Deno.test("Fail to validate if value is not a string.", () => {
  const fn = generateStringValidationFunction(simpleString);
  assertValidationErrorFirstMessage(fn(123), "must be a string");
  assertValidationErrorFirstMessage(fn(), "must be a string");
});

Deno.test("Fail to validate if value is too short.", () => {
  const fn = generateStringValidationFunction(simpleString);
  assertValidationErrorFirstMessage(fn("abcd"), "must have 5 or more characters");
});

Deno.test("Fail to validate if value is too long.", () => {
  const fn = generateStringValidationFunction(simpleString);
  assertValidationErrorFirstMessage(fn("abcdefghijk"), "must have 10 or less characters");
});

Deno.test("Fail to validate if value does not match regex pattern.", () => {
  const fn = generateStringValidationFunction(simpleString);
  assertValidationErrorFirstMessage(fn("abCdef"), "must match regex pattern");
});
