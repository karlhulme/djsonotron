import { assertStrictEquals } from "../../deps.ts";
import { getJsonotronTypeFormalName } from "./getJsonotronTypeFormalName.ts";

Deno.test("Get the interface name of a jsonotron record type.", () => {
  assertStrictEquals(
    getJsonotronTypeFormalName({
      kind: "record",
      name: "testType",
      pluralName: "testTypes",
      system: "testSystem",
      summary: "A test type",
    }),
    "TestSystemTestType",
  );
});
