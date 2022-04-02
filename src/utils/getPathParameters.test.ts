import { getPathParameters } from "./getPathParameters.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("Get single parameter from path with short type name.", () => {
  assertEquals(getPathParameters("/path/{id:uuid}"), [{
    name: 'id',
    type: 'uuid'
  }]);
});

Deno.test("Get single parameter from path with long type name.", () => {
  assertEquals(getPathParameters("/path/{id:std/uuid}"), [{
    name: 'id',
    type: 'std/uuid'
  }]);
});

Deno.test("Get multiple parameters from path.", () => {
  assertEquals(getPathParameters("/path/{first:std/uuid}/path/{second:shortString}"), [{
    name: 'first',
    type: 'std/uuid'
  }, {
    name: 'second',
    type: 'shortString'
  }]);
});
