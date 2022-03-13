import { getTypeFromTypeString } from "./getTypeFromTypeString.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("Type string with no system is returned.", () => {
  assertEquals(getTypeFromTypeString("testType"), "testType");
});

Deno.test("Type string with system is extracted.", () => {
  assertEquals(getTypeFromTypeString("sys/testType"), "testType");
});

Deno.test("Type string system is based on first forward slash.", () => {
  assertEquals(getTypeFromTypeString("sys/sys2/testType"), "sys2/testType");
});
