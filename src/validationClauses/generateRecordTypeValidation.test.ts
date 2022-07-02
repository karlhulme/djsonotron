// deno-lint-ignore-file no-explicit-any
import { assertEquals } from "../../deps.ts";
import {
  IntTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
  RecordTypeDefProperty,
  StringTypeDef,
} from "../interfaces/index.ts";
import { generateRecordTypeValidation } from "./generateRecordTypeValidation.ts";
import { createValidationFunction } from "./createValidationFunction.ts";
import { assertValidationErrorFirstMessage } from "./shared.test.ts";

const simpleString: StringTypeDef = {
  kind: "string",
  system: "test",
  name: "simpleString",
  summary: "A type used for testing.",
  maximumLength: 10,
};

const simpleInt: IntTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleInt",
  summary: "A type used for testing.",
  minimum: 1,
  maximum: 100,
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
  }, {
    name: "nullProp",
    propertyType: "test/simpleInt",
    summary: "A type used for testing.",
    isNullable: true,
  }, {
    name: "constProp",
    propertyType: "test/simpleString",
    summary: "A type used for testing.",
    constant: "foo",
  }, {
    name: "arrayProp",
    propertyType: "test/simpleInt",
    summary: "A type used for testing.",
    isArray: true,
  }, {
    name: "reqArrayProp",
    propertyType: "test/simpleInt",
    summary: "A type used for testing.",
    isArray: true,
    isRequired: true,
  }, {
    name: "errorProp",
    propertyType: "test/unknown",
    summary: "A type used for testing.",
  }],
};

const allTypes = [simpleInt, simpleRecord, simpleString];

function generateRecordValidationFunction(
  def: RecordTypeDef,
  types: JsonotronTypeDef[],
) {
  const fnBody = generateRecordTypeValidation({
    def,
    valuePath: "value",
    valueDisplayPath: "value",
    types,
  });

  return createValidationFunction(fnBody);
}

function generateValidRecord() {
  return {
    reqProp: 1,
    nullProp: 2 as number | null,
    constProp: "foo",
    arrayProp: [3, 4, 5],
    reqArrayProp: [],
  };
}

Deno.test("Validate a valid record.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord();
  assertEquals(fn(record), []);
});

Deno.test("Validate a record with null properties.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord();
  record.nullProp = null;
  assertEquals(fn(record), []);
});

Deno.test("Reject a record that is not an object.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  assertValidationErrorFirstMessage(fn(123), "must be an object");
  assertValidationErrorFirstMessage(fn(), "must be an object");
  assertValidationErrorFirstMessage(fn(null), "must be an object");
  assertValidationErrorFirstMessage(fn([]), "must be an object");
});

Deno.test("Reject a record with a property that is required but not defined.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord() as any;
  delete record.reqProp;
  assertValidationErrorFirstMessage(fn(record), "a required property");
});

Deno.test("Reject a record with a property that is null but not nullable.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord() as any;
  record.reqProp = null;
  assertValidationErrorFirstMessage(fn(record), "must not be null");
});

Deno.test("Reject a record with a property that is an invalid constant.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord() as any;
  record.constProp = "incorrect";
  assertValidationErrorFirstMessage(fn(record), "must be constant string");
});

Deno.test("Reject a record with a property of an unknown type.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord() as any;
  record.errorProp = "value";
  assertValidationErrorFirstMessage(
    fn(record),
    "cannot conform to unknown type",
  );
});

Deno.test("Reject a record with am array property of an unknown type.", () => {
  const testSimpleRecord = structuredClone(simpleRecord) as RecordTypeDef;
  (testSimpleRecord.properties.find((p) =>
    p.name === "reqArrayProp"
  ) as RecordTypeDefProperty).propertyType = "test/unknown";
  const fn = generateRecordValidationFunction(testSimpleRecord, allTypes);
  const record = generateValidRecord() as any;
  assertValidationErrorFirstMessage(
    fn(record),
    "cannot conform to unknown type",
  );
});

Deno.test("Reject a record with an array property that does not have an array value.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord() as any;
  record.arrayProp = 123;
  assertValidationErrorFirstMessage(fn(record), "must be an array of objects");

  const record2 = generateValidRecord() as any;
  record2.arrayProp = "not-array";
  assertValidationErrorFirstMessage(fn(record2), "must be an array of objects");
});

Deno.test("Reject a record with an array property with invalid element values.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord() as any;
  record.arrayProp = [1, 2, "invalid"];
  assertValidationErrorFirstMessage(fn(record), "must be a number");
});

Deno.test("Reject a record with a property with an invalid value.", () => {
  const fn = generateRecordValidationFunction(simpleRecord, allTypes);
  const record = generateValidRecord() as any;
  record.reqProp = "foo";
  assertValidationErrorFirstMessage(fn(record), "must be a number");
});
