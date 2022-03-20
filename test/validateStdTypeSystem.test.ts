import { stdSystemTypes, validateJsonotronTypes } from "../mod.ts";
import { assertStrictEquals } from "../deps.ts";

Deno.test("Validate the jsonotron std type system.", () => {
  const errors = validateJsonotronTypes(stdSystemTypes);
  console.log(JSON.stringify(errors, null, 2));
  assertStrictEquals(errors.length, 0);
});
