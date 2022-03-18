import { generateTypescriptForJsonotronTypes, stdSystemTypes } from "../mod.ts";
import { assertStrictEquals } from "../deps.ts";

Deno.test("Produce typescript output for standard system.", () => {
  const tsFileContents = generateTypescriptForJsonotronTypes(stdSystemTypes);
  assertStrictEquals(tsFileContents.length, 1395);
});
