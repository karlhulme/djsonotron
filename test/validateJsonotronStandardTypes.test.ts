import { stdSystemTypes, validateJsonotronTypes } from "../mod.ts";
import { assertStrictEquals } from "../deps.ts";

Deno.test("Validate the jsonotron standard types.", () => {
  const errors = validateJsonotronTypes(stdSystemTypes);
  assertStrictEquals(errors.length, 0);
});
