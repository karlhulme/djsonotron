import { stdSystemTypes, validateJsonotronTypes } from "../mod.ts";
import { assertStrictEquals } from "../deps.ts";

Deno.test("Validate the jsonotron standard types.", () => {
  const errors = validateJsonotronTypes(stdSystemTypes);
  console.log(JSON.stringify(errors, null, 2));
  assertStrictEquals(errors.length, 0);
});
