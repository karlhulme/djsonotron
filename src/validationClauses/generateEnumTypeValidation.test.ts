import { assertEquals } from "../../deps.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateEnumTypeValidation } from "./generateEnumTypeValidation.ts";
import { createValidationFunction } from "./createValidationFunction.ts";
import { assertValidationErrorFirstMessage } from "./shared.test.ts";

const simpleEnum: EnumTypeDef = {
  kind: "enum",
  system: "test",
  name: "simpleEnum",
  summary: "A type used for testing.",
  items: [{
    value: "first",
  }, {
    value: "second",
  }],
};

function generateEnumValidationFunction(def: EnumTypeDef) {
  const fnBody = generateEnumTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
  });

  return createValidationFunction(fnBody);
}

Deno.test("Validate a valid enum value.", () => {
  const fn = generateEnumValidationFunction(simpleEnum);
  assertEquals(fn("first"), []);
  assertEquals(fn("second"), []);
});

Deno.test("Fail to validate if value is not a string.", () => {
  const fn = generateEnumValidationFunction(simpleEnum);
  assertValidationErrorFirstMessage(fn(123), "must be a string");
  assertValidationErrorFirstMessage(fn(), "must be a string");
});

Deno.test("Fail to validate if value is not one of the enum values.", () => {
  const fn = generateEnumValidationFunction(simpleEnum);
  assertValidationErrorFirstMessage(fn("unknown"), "must be one of");
});
