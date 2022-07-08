import { stdSystemTypes, validateJsonotronTypes } from "../mod.ts";
import { assertEquals } from "../deps.ts";

Deno.test("Validate the jsonotron standard types.", () => {
  const errors = validateJsonotronTypes(stdSystemTypes);
  assertEquals(errors, []);
});
