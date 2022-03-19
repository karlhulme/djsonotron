import { assertEquals } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateBoolTypeValidation } from "./generateBoolTypeValidation.ts";
import {
  assertValidationErrorFirstMessage,
  createValidationFunction,
} from "./shared.test.ts";

const simpleBool: JsonotronTypeDef = {
  kind: "bool",
  system: "test",
  name: "simpleBool",
  summary: "A type used for testing."
};

function generateBoolValidationFunction(def: JsonotronTypeDef) {
  const fnBody = generateBoolTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
  });

  return createValidationFunction(fnBody);
}

Deno.test("Validate a valid boolean value.", () => {
  const fn = generateBoolValidationFunction(simpleBool);
  assertEquals(fn(true), []);
  assertEquals(fn(false), []);
});

Deno.test("Fail to validate if value is not a boolean.", () => {
  const fn = generateBoolValidationFunction(simpleBool);
  assertValidationErrorFirstMessage(fn("not a bool"), "must be a boolean");
  assertValidationErrorFirstMessage(fn(), "must be a boolean");
});
