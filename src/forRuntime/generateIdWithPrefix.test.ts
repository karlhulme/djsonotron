import { assert, assertThrows } from "../../deps.ts";
import { generateIdWithPrefix } from "./generateIdWithPrefix.ts";

Deno.test("Reject a prefix that is too short.", () => {
  assertThrows(() => {
    generateIdWithPrefix("1");
  });
});

Deno.test("Generate an id with a prefix.", () => {
  for (let i = 0; i < 20; i++) {
    const id = generateIdWithPrefix("ex");
    assert(/^[a-z]{2,5}_[a-zA-Z0-9]{8,44}$/.test(id));
  }
});
