import { convertServicePathToOpenApiPath } from "./convertServicePathToOpenApiPath.ts";
import { assertStrictEquals } from "../../deps.ts";

Deno.test("Convert jsonotron path with one parameter to oak path.", () => {
  assertStrictEquals(
    convertServicePathToOpenApiPath("/path/{id:uuid}"),
    "/path/{id}",
  );
});

Deno.test("Convert jsonotron path with one long parameter to oak path.", () => {
  assertStrictEquals(
    convertServicePathToOpenApiPath("/path/{id:std/uuid}"),
    "/path/{id}",
  );
});

Deno.test("Convert jsonotron path with multiple parameters to oak path.", () => {
  assertStrictEquals(
    convertServicePathToOpenApiPath(
      "/path/{first:std/uuid}/path/{second:shortString}",
    ),
    "/path/{first}/path/{second}",
  );
});
