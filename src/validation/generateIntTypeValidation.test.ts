import { assertEquals } from "../../deps.ts";
import { IntTypeDef } from "../interfaces/index.ts";
import { generateIntTypeValidation } from "./generateIntTypeValidation.ts";
import {
  assertValidationErrorMessage,
  createValidationFunction,
} from "./shared.test.ts";

const simpleInt: IntTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleInt",
  summary: "A simple integer used for testing",
  minimum: 5,
  maximum: 8,
};

function generateIntValidationFunction(def: IntTypeDef) {
  const fnBody = generateIntTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
  });

  return createValidationFunction(fnBody);
}

Deno.test("Validate an integer that is in range.", () => {
  const fn = generateIntValidationFunction(simpleInt);
  assertEquals(fn(6), []);
});

Deno.test("Fail to validate if value is not integer.", () => {
  const fn = generateIntValidationFunction(simpleInt);
  assertValidationErrorMessage(fn("not an int"), "must be a number");
});
