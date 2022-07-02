import { assertStringIncludes, assertThrows } from "../../deps.ts";
import {
  EnumTypeDef,
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  JsonotronTypeKind,
  RecordTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { generateCodeForJsonotronTypes } from "./generateCodeForJsonotronTypes.ts";

const simpleBool: JsonotronTypeDef = {
  kind: "bool",
  system: "test",
  name: "simpleBool",
  summary: "A type used for testing.",
};

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

const simpleObject: JsonotronTypeDef = {
  kind: "object",
  system: "test",
  name: "simpleObject",
  summary: "A type used for testing.",
};

const simpleString: StringTypeDef = {
  kind: "string",
  system: "test",
  name: "simpleString",
  summary: "A type used for testing.",
  maximumLength: 10,
  minimumLength: 5,
  regex: "^[a-z]+$",
};

const fullRecord: RecordTypeDef = {
  system: "test",
  name: "fullRecord",
  kind: "record",
  summary: "a test type",
  properties: [{
    name: "boolProp",
    summary: "A field",
    propertyType: "test/simpleBool",
    isRequired: true,
  }, {
    name: "enumProp",
    summary: "A field",
    propertyType: "test/simpleEnum",
  }, {
    name: "floatProp",
    summary: "A field",
    propertyType: "test/simpleFloat",
  }, {
    name: "intProp",
    summary: "A field",
    propertyType: "test/simpleInt",
  }, {
    name: "objProp",
    summary: "A field",
    propertyType: "test/simpleObject",
  }, {
    name: "recordProp",
    summary: "A field",
    propertyType: "test/fullRecord",
    isNullable: true,
  }, {
    name: "stringProp",
    summary: "A field",
    propertyType: "test/simpleString",
    isArray: true,
  }],
};

Deno.test("Generate typescript for a set of types.", () => {
  const types = [
    simpleBool,
    simpleEnum,
    simpleFloat,
    simpleInt,
    simpleObject,
    simpleString,
    fullRecord,
  ];

  const output = generateCodeForJsonotronTypes(types);
  // console.log(output)
  assertStringIncludes(output, "export interface ValidationError");
  assertStringIncludes(output, "export const testSimpleEnumValues");
  assertStringIncludes(output, "export interface TestFullRecord");
  assertStringIncludes(output, "boolProp: boolean");
  assertStringIncludes(output, "enumProp?: TestSimpleEnum");
  assertStringIncludes(output, "floatProp?: number");
  assertStringIncludes(output, "intProp?: number");
  assertStringIncludes(output, "objProp?: unknown");
  assertStringIncludes(output, "recordProp?: TestFullRecord|null");
  assertStringIncludes(output, "stringProp?: string[]");
  assertStringIncludes(output, "export function validateTestFullRecord");
  assertStringIncludes(output, "export function validateTestFullRecordArray");
});

Deno.test("Generate typescript where a referenced type is missing.", () => {
  const types = [
    simpleString,
    fullRecord,
  ];

  const output = generateCodeForJsonotronTypes(types);
  assertStringIncludes(output, "export interface TestFullRecord");
  assertStringIncludes(output, "recordProp?: TestFullRecord|null");
  assertStringIncludes(output, "stringProp?: string[]");
  assertStringIncludes(output, "cannot conform to unknown type");
});

Deno.test("Generate typescript for invalid type.", () => {
  const invalidType: JsonotronTypeDef = {
    system: "test",
    name: "invalidType",
    kind: "unknown" as unknown as JsonotronTypeKind,
    summary: "A test type",
  };

  const recordWithPropertyOfInvalidType: RecordTypeDef = {
    system: "test",
    name: "recordWithPropertyOfInvalidType",
    kind: "record",
    summary: "A test type",
    properties: [{
      name: "invalidProp",
      summary: "A field",
      propertyType: "test/invalidType",
    }],
  };

  assertThrows(
    () =>
      generateCodeForJsonotronTypes([
        invalidType,
        recordWithPropertyOfInvalidType,
      ]),
    Error,
    "Unrecognised type kind",
  );
});
