import { assertEquals } from "../../deps.ts";
import { TypeDefValidationError } from "../interfaces/index.ts";
import { validateIntTypeDef } from "./validateIntTypeDef.ts";
import { assertTypeDefValidationErrorFirstMessage } from "./shared.test.ts";

Deno.test("Validate a valid int type.", () => {
  const errors: TypeDefValidationError[] = [];
  validateIntTypeDef({
    kind: "int",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    minimum: 1,
    maximum: 10,
  }, errors);
  assertEquals(errors, []);
});

Deno.test("Fail to validate an int type with inverted minimum and maximum values.", () => {
  const errors: TypeDefValidationError[] = [];
  validateIntTypeDef({
    kind: "int",
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
