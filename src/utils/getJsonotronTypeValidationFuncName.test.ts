import { assertStrictEquals } from "../../deps.ts";
import { getJsonotronTypeValidationFuncName } from "./getJsonotronTypeValidationFuncName.ts";

Deno.test("Get the validation function name of jsonotron type.", () => {
  assertStrictEquals(
    getJsonotronTypeValidationFuncName({
      kind: "enum",
      name: "testType",
      system: "testSystem",
      summary: "A test type",
    }, false),
    "validateTestSystemTestType",
  );
});

Deno.test("Get the validation function name of jsonotron type array.", () => {
  assertStrictEquals(
    getJsonotronTypeValidationFuncName({
      kind: "enum",
      name: "testType",
      system: "testSystem",
      summary: "A test type",
    }, true),
    "validateTestSystemTestTypeArray",
  );
});
