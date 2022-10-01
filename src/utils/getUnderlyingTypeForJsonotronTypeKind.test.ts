import { getUnderlyingTypeForJsonotronTypeKind } from "./getUnderlyingTypeForJsonotronTypeKind.ts";
import { assertEquals, assertStrictEquals } from "../../deps.ts";
import { JsonotronTypeKind } from "../interfaces/JsonotronTypeKind.ts";

Deno.test("Convert from jsonotron type kinds to json schema types.", () => {
  assertStrictEquals(getUnderlyingTypeForJsonotronTypeKind("bool"), "boolean");
  assertStrictEquals(getUnderlyingTypeForJsonotronTypeKind("int"), "number");
  assertStrictEquals(getUnderlyingTypeForJsonotronTypeKind("float"), "number");
  assertStrictEquals(getUnderlyingTypeForJsonotronTypeKind("object"), "object");
  assertStrictEquals(getUnderlyingTypeForJsonotronTypeKind("record"), "object");
  assertStrictEquals(getUnderlyingTypeForJsonotronTypeKind("enum"), "string");
  assertStrictEquals(getUnderlyingTypeForJsonotronTypeKind("string"), "string");
  assertEquals(
    getUnderlyingTypeForJsonotronTypeKind("variant"),
    "unknown",
  );
  assertStrictEquals(
    getUnderlyingTypeForJsonotronTypeKind(
      "other" as unknown as JsonotronTypeKind,
    ),
    "object",
  );
});
