// import { assert } from "../../deps.ts";
import {
  assert,
  assertThrows,
} from "https://deno.land/std@0.156.0/testing/asserts.ts";
import { generateIdWithPrefix } from "./generateIdWithPrefix.ts";

Deno.test("Reject a prefix that is too short.", () => {
  assertThrows(() => {
    generateIdWithPrefix("1");
  });
});

Deno.test("Reject a prefix that is too long.", () => {
  assertThrows(() => {
    generateIdWithPrefix("123456");
  });
});

Deno.test("Generate an id with a prefix.", () => {
  for (let i = 0; i < 20; i++) {
    const id = generateIdWithPrefix("ex");
    assert(/^[a-z]{2,5}_[a-zA-Z0-9]{8,44}$/.test(id));
  }
});
