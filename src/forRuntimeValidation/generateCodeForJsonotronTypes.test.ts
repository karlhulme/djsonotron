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

type TypeNames =
  | "test/simpleBool"
  | "test/simpleEnum"
  | "test/simpleFloat"
  | "test/simpleInt"
  | "test/simpleObject"
  | "test/simpleString"
  | "test/fullRecord";

const simpleBool: JsonotronTypeDef = {
  kind: "bool",
  system: "test",
  name: "simpleBool",
  pluralName: "simpleBools",
  summary: "A type used for testing.",
};

const simpleEnum: EnumTypeDef = {
  kind: "enum",
  system: "test",
  name: "simpleEnum",
  pluralName: "simpleEnums",
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
  pluralName: "simpleFloats",
  summary: "A type used for testing.",
  minimum: 10,
  maximum: 12,
};

const simpleInt: IntTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleInt",
  pluralName: "simpleInts",
  summary: "A type used for testing.",
  minimum: 5,
  maximum: 8,
};

const simpleObject: JsonotronTypeDef = {
  kind: "object",
  system: "test",
  name: "simpleObject",
  pluralName: "simpleObject",
  summary: "A type used for testing.",
};

const simpleString: StringTypeDef = {
  kind: "string",
  system: "test",
  name: "simpleString",
  pluralName: "simpleString",
  summary: "A type used for testing.",
  maximumLength: 10,
  minimumLength: 5,
  regex: "^[a-z]+$",
};

const fullRecord: RecordTypeDef<TypeNames> = {
  system: "test",
  name: "fullRecord",
  pluralName: "fullRecords",
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
  assertStringIncludes(output, "export interface ValidationError");
  assertStringIncludes(output, "export const allTestSimpleEnumValues");
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
  assertStringIncludes(output, "export type TestTypeNames");
});

Deno.test("Generate typescript where a referenced type is missing.", () => {
  assertThrows(
    () =>
      generateCodeForJsonotronTypes([
        simpleString,
        fullRecord,
      ]),
    Error,
    "Unable to resolve type: test/simpleBool",
  );
});

Deno.test("Generate typescript for invalid type.", () => {
  const invalidType: JsonotronTypeDef = {
    system: "test",
    name: "invalidType",
    pluralName: "invalidTypes",
    kind: "unknown" as unknown as JsonotronTypeKind,
    summary: "A test type",
  };

  const recordWithPropertyOfInvalidType: RecordTypeDef<
    TypeNames | "test/invalidType"
  > = {
    system: "test",
    name: "recordWithPropertyOfInvalidType",
    pluralName: "recordsWithPropertyOfInvalidType",
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
