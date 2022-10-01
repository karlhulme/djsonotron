import { getJsonSchemaTypeForJsonotronTypeKind } from "./getJsonSchemaTypeForJsonotronTypeKind.ts";
import { assertStrictEquals } from "../../deps.ts";
import { JsonotronTypeKind } from "../interfaces/JsonotronTypeKind.ts";

Deno.test("Convert from jsonotron type kinds to json schema types.", () => {
  assertStrictEquals(getJsonSchemaTypeForJsonotronTypeKind("bool"), "boolean");
  assertStrictEquals(getJsonSchemaTypeForJsonotronTypeKind("int"), "number");
  assertStrictEquals(getJsonSchemaTypeForJsonotronTypeKind("float"), "number");
  assertStrictEquals(getJsonSchemaTypeForJsonotronTypeKind("object"), "object");
  assertStrictEquals(getJsonSchemaTypeForJsonotronTypeKind("record"), "object");
  assertStrictEquals(getJsonSchemaTypeForJsonotronTypeKind("enum"), "string");
  assertStrictEquals(getJsonSchemaTypeForJsonotronTypeKind("string"), "string");
  assertStrictEquals(
    getJsonSchemaTypeForJsonotronTypeKind("variant"),
    "unknown",
  );
  assertStrictEquals(
    getJsonSchemaTypeForJsonotronTypeKind(
      "other" as unknown as JsonotronTypeKind,
    ),
    "object",
  );
});
