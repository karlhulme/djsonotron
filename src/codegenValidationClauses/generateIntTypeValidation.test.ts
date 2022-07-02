import { assertEquals } from "../../deps.ts";
import { IntTypeDef } from "../interfaces/index.ts";
import { generateIntTypeValidation } from "./generateIntTypeValidation.ts";
import { createValidationFunction } from "./createValidationFunction.ts";
import { assertValidationErrorFirstMessage } from "./shared.test.ts";

const simpleInt: IntTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleInt",
  pluralName: "simpleInts",
  summary: "A type used for testing.",
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

Deno.test("Validate a valid integer.", () => {
  const fn = generateIntValidationFunction(simpleInt);
  assertEquals(fn(5), []);
  assertEquals(fn(8), []);
});

Deno.test("Fail to validate if value is not a number.", () => {
  const fn = generateIntValidationFunction(simpleInt);
  assertValidationErrorFirstMessage(fn("not an int"), "must be a number");
  assertValidationErrorFirstMessage(fn(), "must be a number");
});

Deno.test("Fail to validate if value is not a whole number.", () => {
  const fn = generateIntValidationFunction(simpleInt);
  assertValidationErrorFirstMessage(fn(6.5), "must be a whole number");
});

Deno.test("Fail to validate if value is below minimum.", () => {
  const fn = generateIntValidationFunction(simpleInt);
  assertValidationErrorFirstMessage(
    fn(4),
    "must be greater than or equal to 5",
  );
});

Deno.test("Fail to validate if value is above maximum.", () => {
  const fn = generateIntValidationFunction(simpleInt);
  assertValidationErrorFirstMessage(fn(9), "must be less than or equal to 8");
});
