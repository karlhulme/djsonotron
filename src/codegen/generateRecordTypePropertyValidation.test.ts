import { assertStrictEquals, assertThrows } from "../../deps.ts";
import {
  EnumTypeDef,
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  JsonotronTypeKind,
  RecordTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { generateRecordTypePropertyValidation } from "./generateRecordTypePropertyValidation.ts";

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

const simpleRecord: RecordTypeDef = {
  system: "test",
  name: "simpleRecord",
  kind: "record",
  summary: "a test type",
  properties: [{
    name: "boolProp",
    summary: "A field",
    propertyType: "test/simpleBool",
  }],
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

Deno.test("Generate a record type property validation.", () => {
  const types = [
    simpleBool,
    simpleEnum,
    simpleFloat,
    simpleInt,
    simpleObject,
    simpleRecord,
    simpleString,
  ];

  for (const type of types) {
    const output = generateRecordTypePropertyValidation({
      def: type,
      types,
      valuePath: "value",
      valueDisplayPath: "value",
    });

    assertStrictEquals(typeof output, "string");
  }
});

Deno.test("Fail to generate a record type property validation for an unknown kind.", () => {
  const invalidType: JsonotronTypeDef = {
    kind: "unknown" as unknown as JsonotronTypeKind,
    system: "test",
    name: "simpleBool",
    summary: "A type used for testing.",
  };

  assertThrows(
    () =>
      generateRecordTypePropertyValidation({
        def: invalidType,
        types: [],
        valuePath: "value",
        valueDisplayPath: "value",
      }),
    Error,
    "Unrecognised type kind",
  );
});
