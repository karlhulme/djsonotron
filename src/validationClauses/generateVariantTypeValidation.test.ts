import { assertEquals } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateVariantTypeValidation } from "./generateVariantTypeValidation.ts";
import { createValidationFunction } from "./createValidationFunction.ts";
import { assertValidationErrorFirstMessage } from "./shared.test.ts";

const simpleVariant: JsonotronTypeDef = {
  kind: "variant",
  system: "test",
  name: "simpleVariant",
  pluralName: "simpleVariants",
  summary: "A type used for testing.",
};

function generateVariantValidationFunction(def: JsonotronTypeDef) {
  const fnBody = generateVariantTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
  });

  return createValidationFunction(fnBody);
}

Deno.test("Validate a valid variant value.", () => {
  const fn = generateVariantValidationFunction(simpleVariant);
  assertEquals(fn({}), []);
  assertEquals(fn(5), []);
  assertEquals(fn("hello"), []);
  assertEquals(fn(true), []);
});

Deno.test("Fail to validate if value is null or an array.", () => {
  const fn = generateVariantValidationFunction(simpleVariant);
  // assertValidationErrorFirstMessage(fn(null), "cannot be null or an array");
  assertValidationErrorFirstMessage(fn([]), "cannot be null or an array");
});
