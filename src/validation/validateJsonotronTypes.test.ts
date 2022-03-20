import { assertEquals, assertStrictEquals } from "../../deps.ts";
import {
  FloatTypeDef,
  IntTypeDef,
  RecordTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { validateJsonotronTypes } from "./validateJsonotronTypes.ts";

const simpleFloat: FloatTypeDef = {
  kind: "float",
  system: "test",
  name: "simpleFloat",
  summary: "A type used for testing.",
  minimum: 10,
  maximum: 12,
};

const simpleInt: IntTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleInt",
  summary: "A type used for testing.",
  minimum: 5,
  maximum: 8,
};

const simpleRecord: RecordTypeDef = {
  kind: "record",
  system: "test",
  name: "simpleRecord",
  summary: "A type used for testing.",
  properties: [{
    name: "reqProp",
    propertyType: "test/simpleInt",
    summary: "A type used for testing.",
    isRequired: true,
  }],
};

const simpleString: StringTypeDef = {
  kind: "string",
  system: "test",
  name: "simpleString",
  summary: "A type used for testing.",
  maximumLength: 10,
};

Deno.test("Validate a set of types that produces no errors.", () => {
  const types = [simpleFloat, simpleInt, simpleRecord, simpleString];
  const errors = validateJsonotronTypes(types);
  assertEquals(errors, []);
});

Deno.test("Validate a set of types that produces errors.", () => {
  // Make types invalid by omitting simpleInt which is referenced by simpleRecord.
  const types = [simpleFloat, simpleRecord, simpleString];
  const errors = validateJsonotronTypes(types);
  assertStrictEquals(errors.length > 0, true);
});
