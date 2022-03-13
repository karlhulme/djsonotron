import { generateTypescriptForJsonotronTypes, stdSystemTypes } from "../mod.ts";
import { assertEquals } from "../deps.ts";

Deno.test("Produce typescript output for standard system.", () => {
  const tsFileContents = generateTypescriptForJsonotronTypes(stdSystemTypes)
  console.log(tsFileContents)
  assertEquals(tsFileContents.length, 1422)
});
