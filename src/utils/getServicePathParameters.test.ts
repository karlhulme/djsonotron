import { getServicePathParameters } from "./getServicePathParameters.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("Get single parameter from path with short type name.", () => {
  assertEquals(getServicePathParameters("/path/{id:uuid}"), [{
    name: "id",
    type: "uuid",
  }]);
});

Deno.test("Get single parameter from path with long type name.", () => {
  assertEquals(getServicePathParameters("/path/{id:std/uuid}"), [{
    name: "id",
    type: "std/uuid",
  }]);
});

Deno.test("Get multiple parameters from path.", () => {
  assertEquals(
    getServicePathParameters("/path/{first:std/uuid}/path/{second:shortString}"),
    [{
      name: "first",
      type: "std/uuid",
    }, {
      name: "second",
      type: "shortString",
    }],
  );
});
