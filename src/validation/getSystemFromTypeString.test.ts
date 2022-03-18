import { getSystemFromTypeString } from "./getSystemFromTypeString.ts";
import { assertStrictEquals } from "../../deps.ts";

Deno.test("Type string with no system is assumed to be std.", () => {
  assertStrictEquals(getSystemFromTypeString("testType"), "std");
});

Deno.test("Type string with no system is assigned to given default.", () => {
  assertStrictEquals(getSystemFromTypeString("testType", "default"), "default");
});

Deno.test("Type string with system is extracted.", () => {
  assertStrictEquals(getSystemFromTypeString("sys/testType"), "sys");
  assertStrictEquals(getSystemFromTypeString("sys/testType", "default"), "sys");
});

Deno.test("Type string system is based on first forward slash.", () => {
  assertStrictEquals(getSystemFromTypeString("sys/sys2/testType"), "sys");
});
