import { assertEquals } from "../../deps.ts";
import { FloatTypeDef } from "../interfaces/index.ts";
import { generateFloatTypeValidation } from "./generateFloatTypeValidation.ts";
import { createValidationFunction } from "./createValidationFunction.ts";
import { assertValidationErrorFirstMessage } from "./shared.test.ts";

const simpleFloat: FloatTypeDef = {
  kind: "float",
  system: "test",
  name: "simpleFloat",
  pluralName: "simpleFloats",
  summary: "A type used for testing.",
  minimum: 10,
  maximum: 12,
};

const simpleFloatExclusive: FloatTypeDef = {
  kind: "float",
  system: "test",
  name: "simpleFloat",
  pluralName: "simpleFloats",
  summary: "A type used for testing.",
  minimum: 10,
  isMinimumExclusive: true,
  maximum: 12,
  isMaximumExclusive: true,
};

function generateFloatValidationFunction(def: FloatTypeDef) {
  const fnBody = generateFloatTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
  });

  return createValidationFunction(fnBody);
}

Deno.test("Validate a valid float value.", () => {
  const fn = generateFloatValidationFunction(simpleFloat);
  assertEquals(fn(10), []);
  assertEquals(fn(12), []);
});

Deno.test("Fail to validate if value is not a number.", () => {
  const fn = generateFloatValidationFunction(simpleFloat);
  assertValidationErrorFirstMessage(fn("not a number"), "must be a number");
  assertValidationErrorFirstMessage(fn(), "must be a number");
});

Deno.test("Fail to validate if value is less than minimum.", () => {
  const fn = generateFloatValidationFunction(simpleFloat);
  assertValidationErrorFirstMessage(
    fn(9.9),
    "must be greater than or equal to 10",
  );
});

Deno.test("Fail to validate if value is more than maximum.", () => {
  const fn = generateFloatValidationFunction(simpleFloat);
  assertValidationErrorFirstMessage(
    fn(12.1),
    "must be less than or equal to 12",
  );
});

Deno.test("Fail to validate if value is at minimum but float definition is exclusive.", () => {
  const fn = generateFloatValidationFunction(simpleFloatExclusive);
  assertValidationErrorFirstMessage(fn(10), "must be greater than 10");
});

Deno.test("Fail to validate if value is at maximum but float definition is exclusive.", () => {
  const fn = generateFloatValidationFunction(simpleFloatExclusive);
  assertValidationErrorFirstMessage(fn(12), "must be less than 12");
});
