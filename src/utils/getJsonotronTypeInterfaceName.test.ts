import { assertStrictEquals, assertThrows } from "../../deps.ts";
import { getJsonotronTypeInterfaceName } from "./getJsonotronTypeInterfaceName.ts";

Deno.test("Get the interface name of a jsonotron record type.", () => {
  assertStrictEquals(
    getJsonotronTypeInterfaceName({
      kind: "record",
      name: "testType",
      system: "testSystem",
      summary: "A test type",
    }),
    "TestSystemTestType",
  );
});

Deno.test("Fail to get interface name of a non-record jsonotron type.", () => {
  assertThrows(() =>
    getJsonotronTypeInterfaceName({
      kind: "float",
      name: "testType",
      system: "testSystem",
      summary: "A test type",
    })
  );
});
