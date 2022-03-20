import { getTypeFromTypeString } from "./getTypeFromTypeString.ts";
import { assertStrictEquals } from "../../deps.ts";

Deno.test("Type string with no system is returned.", () => {
  assertStrictEquals(getTypeFromTypeString("testType"), "testType");
});

Deno.test("Type string with system is extracted.", () => {
  assertStrictEquals(getTypeFromTypeString("sys/testType"), "testType");
});

Deno.test("Type string system is based on first forward slash.", () => {
  assertStrictEquals(
    getTypeFromTypeString("sys/sys2/testType"),
    "sys2/testType",
  );
});
