import { JsonotronTypeDef } from "../interfaces/index.ts";
import { resolveJsonotronType } from "./resolveJsonotronType.ts";
import { assertStrictEquals, assertThrows } from "../../deps.ts";

const types: JsonotronTypeDef[] = [{
  kind: "int",
  name: "testInt",
  pluralName: "testInts",
  system: "std",
  summary: "A test int type.",
}, {
  kind: "string",
  name: "testString",
  pluralName: "testStrings",
  system: "std",
  summary: "A test string type.",
}];

Deno.test("Get type using short name.", () => {
  assertStrictEquals(resolveJsonotronType("testInt", types), types[0]);
});

Deno.test("Get type using full name.", () => {
  assertStrictEquals(resolveJsonotronType("std/testInt", types), types[0]);
});

Deno.test("Fail to get type.", () => {
  assertThrows(() => resolveJsonotronType("madeup/testInt", types));
});
