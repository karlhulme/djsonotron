import { assertEquals } from "../../deps.ts";
import { TypeDefValidationError } from "../interfaces/index.ts";
import { validateFloatTypeDef } from "./validateFloatTypeDef.ts";
import { assertTypeDefValidationErrorFirstMessage } from "./shared.test.ts";

Deno.test("Validate a valid float type.", () => {
  const errors: TypeDefValidationError[] = [];
  validateFloatTypeDef({
    kind: "float",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    minimum: 1,
    maximum: 10,
  }, errors);
  assertEquals(errors, []);
});

Deno.test("Fail to validate a float type with inverted minimum and maximum values.", () => {
  const errors: TypeDefValidationError[] = [];
  validateFloatTypeDef({
    kind: "float",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    minimum: 10,
    maximum: 5,
  }, errors);
  assertTypeDefValidationErrorFirstMessage(
    errors,
    "minimum value must be less than or equal to the maximum",
  );
});
