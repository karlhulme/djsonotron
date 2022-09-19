import { assertStringIncludes } from "../../deps.ts";
import { stringifyJRuntimeType } from "./stringifyJRuntimeType.ts";

Deno.test("Stringify the runtime type.", () => {
  const output = stringifyJRuntimeType({
    name: "test",
    underlyingType: "string",
    validator: "validateTest",
    schema: {
      type: "string",
    },
  });
  assertStringIncludes(output, `name: "test"`);
  assertStringIncludes(output, `underlyingType: "string"`);
  assertStringIncludes(output, `validator: validateTest`);
  assertStringIncludes(output, `schema: {"type":"string"}`);
});
