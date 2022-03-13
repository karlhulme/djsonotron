import { getSystemFromTypeString } from "./getSystemFromTypeString.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("Type string with no system is assumed to be std.", () => {
  assertEquals(getSystemFromTypeString("testType"), "std");
});

Deno.test("Type string with no system is assigned to given default.", () => {
  assertEquals(getSystemFromTypeString("testType", "default"), "default");
});

Deno.test("Type string with system is extracted.", () => {
  assertEquals(getSystemFromTypeString("sys/testType"), "sys");
  assertEquals(getSystemFromTypeString("sys/testType", "default"), "sys");
});

Deno.test("Type string system is based on first forward slash.", () => {
  assertEquals(getSystemFromTypeString("sys/sys2/testType"), "sys");
});
