import { assertEquals } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateObjectTypeValidation } from "./generateObjectTypeValidation.ts";
import { createValidationFunction } from "./createValidationFunction.ts";
import { assertValidationErrorFirstMessage } from "./shared.test.ts";

const simpleObject: JsonotronTypeDef = {
  kind: "object",
  system: "test",
  name: "simpleObject",
  pluralName: "simpleObjects",
  summary: "A type used for testing.",
};

function generateObjectValidationFunction(def: JsonotronTypeDef) {
  const fnBody = generateObjectTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
  });

  return createValidationFunction(fnBody);
}

Deno.test("Validate a valid object value.", () => {
  const fn = generateObjectValidationFunction(simpleObject);
  assertEquals(fn({}), []);
});

Deno.test("Fail to validate if value is not an object.", () => {
  const fn = generateObjectValidationFunction(simpleObject);
  assertValidationErrorFirstMessage(fn("not an object"), "must be an object");
  assertValidationErrorFirstMessage(fn(123), "must be an object");
  assertValidationErrorFirstMessage(fn(true), "must be an object");
  assertValidationErrorFirstMessage(fn([]), "must be an object");
  assertValidationErrorFirstMessage(fn(), "must be an object");
});
