import { stdSystemTypes } from "./src/std/index.ts";
import { generateCodeForJsonotronTypes } from "./src/forCodeGeneration/index.ts";
import { ensureJsonotronTypes } from "./src/designTimeValidation/index.ts";
import { JsonotronTypeDef } from "./src/interfaces/index.ts";

// need to import array of types....
const arg = Deno.args.length > 0 ? Deno.args[0] : "";

if (!arg || !arg.endsWith(".ts")) {
  throw new Error("First argument must be the path to a typescript file.");
}

const module = await import(arg);

console.log(module);

const types = [
  ...stdSystemTypes,
  ...Object.values(module),
] as JsonotronTypeDef[];

ensureJsonotronTypes(types);

const sourceCode = generateCodeForJsonotronTypes(types);

await Deno.writeTextFile(
  "./src/autogen.types.ts",
  sourceCode,
);
