import { assertEquals } from "../../deps.ts";
import { IntTypeDef, TypeDefValidationError } from "../interfaces/index.ts";
import { validateRecordTypeDef } from "./validateRecordTypeDef.ts";
import { assertTypeDefValidationErrorFirstMessage } from "./shared.test.ts";

const simpleInt: IntTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleInt",
  summary: "A type used for testing.",
  minimum: 5,
  maximum: 8,
};

Deno.test("Validate a valid record type.", () => {
  const errors: TypeDefValidationError[] = [];
  validateRecordTypeDef<"test/simpleInt">(
    {
      kind: "record",
      system: "testSystem",
      name: "testType",
      summary: "A type for testing.",
      properties: [{
        name: "first",
        propertyType: "test/simpleInt",
        summary: "A property.",
      }],
      validTestCases: [{
        value: {
          first: 7,
        },
      }],
      invalidTestCases: [{
        value: {
          first: 20,
        },
      }],
    },
    [simpleInt],
    errors,
  );
  assertEquals(errors, []);
});

Deno.test("Fail to validate a record type with an unrecognised property type.", () => {
  const errors: TypeDefValidationError[] = [];
  validateRecordTypeDef(
    {
      kind: "record",
      system: "testSystem",
      name: "testType",
      summary: "A type for testing.",
      properties: [{
        name: "first",
        propertyType: "test/unknown",
        summary: "A property.",
      }],
    },
    [simpleInt],
    errors,
  );
  assertTypeDefValidationErrorFirstMessage(
    errors,
    "unknown type 'test/unknown'",
  );
});

Deno.test("Fail to validate a record type with a valid test case that is rejected.", () => {
  const errors: TypeDefValidationError[] = [];
  validateRecordTypeDef(
    {
      kind: "record",
      system: "testSystem",
      name: "testType",
      summary: "A type for testing.",
      properties: [{
        name: "first",
        propertyType: "test/simpleInt",
        summary: "A property.",
      }],
      validTestCases: [{
        value: {
          first: 100, // invalid because value too high
        },
      }],
    },
    [simpleInt],
    errors,
  );
  assertTypeDefValidationErrorFirstMessage(errors, "test case 0 was rejected");
});

Deno.test("Fail to validate a record type with an invalid test case that is accepted.", () => {
  const errors: TypeDefValidationError[] = [];
  validateRecordTypeDef(
    {
      kind: "record",
      system: "testSystem",
      name: "testType",
      summary: "A type for testing.",
      properties: [{
        name: "first",
        propertyType: "test/simpleInt",
        summary: "A property.",
      }],
      invalidTestCases: [{
        value: {
          first: 6,
        },
      }],
    },
    [simpleInt],
    errors,
  );
  assertTypeDefValidationErrorFirstMessage(
    errors,
    "Invalid test case 0 was accepted",
  );
});
