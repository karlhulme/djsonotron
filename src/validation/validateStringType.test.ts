import { assertEquals } from "../../deps.ts";
import { TypeDefValidationError } from "../interfaces/index.ts";
import { validateStringTypeDef } from "./validateStringTypeDef.ts";
import { assertTypeDefValidationErrorFirstMessage } from "./shared.test.ts";

Deno.test("Validate a valid string type.", () => {
  const errors: TypeDefValidationError[] = [];
  validateStringTypeDef({
    kind: "int",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    minimumLength: 1,
    maximumLength: 10,
    regex: "^[a-z]+$",
    validTestCases: [{
      value: "hello",
    }],
    invalidTestCases: [{
      value: "World", // invalid due to capital letter.
    }],
  }, errors);
  assertEquals(errors, []);
});

Deno.test("Fail to validate a string type with inverted minimum and maximum length values.", () => {
  const errors: TypeDefValidationError[] = [];
  validateStringTypeDef({
    kind: "int",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    minimumLength: 10,
    maximumLength: 5,
  }, errors);
  assertTypeDefValidationErrorFirstMessage(
    errors,
    "Minimum length, if specified, must be less than or equal to maximum",
  );
});

Deno.test("Fail to validate a string type with valid test case that is rejected.", () => {
  const errors: TypeDefValidationError[] = [];
  validateStringTypeDef({
    kind: "int",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    maximumLength: 5,
    regex: "^[a-z]+$",
    validTestCases: [{
      value: "World",
    }],
  }, errors);
  assertTypeDefValidationErrorFirstMessage(errors, "test case 0 was rejected");
});

Deno.test("Fail to validate a string type with an invalid test case that is accepted.", () => {
  const errors: TypeDefValidationError[] = [];
  validateStringTypeDef({
    kind: "int",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    maximumLength: 5,
    regex: "^[a-z]+$",
    invalidTestCases: [{
      value: "hello",
    }],
  }, errors);
  assertTypeDefValidationErrorFirstMessage(errors, "test case 0 was accepted");
});

Deno.test("Fail to validate a string type with an invalid regex expression.", () => {
  const errors: TypeDefValidationError[] = [];
  validateStringTypeDef({
    kind: "int",
    system: "testSystem",
    name: "testType",
    summary: "A type for testing.",
    maximumLength: 5,
    regex: ")(*&^%$£@£$%^&*()(*&^%$£@",
  }, errors);
  assertTypeDefValidationErrorFirstMessage(errors, "could not be parsed");
});
