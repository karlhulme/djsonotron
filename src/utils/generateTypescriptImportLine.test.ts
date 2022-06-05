import { assertStrictEquals } from "../../deps.ts";
import { generateTypescriptImportLine } from "./generateTypescriptImportLine.ts";

Deno.test("Generate a typescript import line with duplicates removed.", () => {
  assertStrictEquals(
    generateTypescriptImportLine(
      ["A", "B", "B", "A"],
      "../src.ts",
    ),
    'import { A, B } from "../src.ts";',
  );
});

Deno.test("Generate a typescript import line for no imports as an empty string.", () => {
  assertStrictEquals(
    generateTypescriptImportLine(
      [],
      "../src.ts",
    ),
    "",
  );
});
