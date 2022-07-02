import { assertStrictEquals } from "../../deps.ts";
import { getJsonotronTypeUnderlyingTypescriptType } from "./getJsonotronTypeUnderlyingTypescriptType.ts";

Deno.test("Get the typescript type of a boolean jsonotron type.", () => {
  assertStrictEquals(
    getJsonotronTypeUnderlyingTypescriptType({
      kind: "bool",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "boolean",
  );
});

Deno.test("Get the typescript type of a number jsonotron type.", () => {
  assertStrictEquals(
    getJsonotronTypeUnderlyingTypescriptType({
      kind: "float",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "number",
  );

  assertStrictEquals(
    getJsonotronTypeUnderlyingTypescriptType({
      kind: "int",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "number",
  );
});

Deno.test("Get the typescript type of a string jsonotron type.", () => {
  assertStrictEquals(
    getJsonotronTypeUnderlyingTypescriptType({
      kind: "string",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "string",
  );
});

Deno.test("Get the typescript type of a string jsonotron type.", () => {
  assertStrictEquals(
    getJsonotronTypeUnderlyingTypescriptType({
      kind: "object",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "unknown",
  );
});

Deno.test("Get the typescript type of an enum & record jsonotron type.", () => {
  assertStrictEquals(
    getJsonotronTypeUnderlyingTypescriptType({
      kind: "enum",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "TestSystemTestType",
  );

  assertStrictEquals(
    getJsonotronTypeUnderlyingTypescriptType({
      kind: "record",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "TestSystemTestType",
  );
});
