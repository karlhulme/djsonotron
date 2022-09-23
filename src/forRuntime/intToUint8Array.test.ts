import { assertStrictEquals } from "../../deps.ts";
import { intToUint8Array } from "./intToUint8Array.ts";

Deno.test("Convert zero integer to int8 array.", () => {
  const arr = intToUint8Array(0);
  assertStrictEquals(arr.length, 1);
  assertStrictEquals(arr[0], 0);
});

Deno.test("Convert non-zero integer to int8 array.", () => {
  const arr = intToUint8Array(1234);
  assertStrictEquals(arr.length, 2);
  assertStrictEquals(arr[0], 4);
  assertStrictEquals(arr[1], 210);
});
