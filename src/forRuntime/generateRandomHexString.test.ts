import { assertEquals, assertThrows } from "../../deps.ts";
import { generateRandomHexString } from "./generateRandomHexString.ts";

Deno.test("Generate a random hex string of a specified length.", () => {
  const lengths = [2, 4, 6, 8, 10, 12, 14, 16, 32, 64];

  for (const length of lengths) {
    const s = generateRandomHexString(length);
    assertEquals(s.length, length);
  }
});

Deno.test("Fail to generate a random hex string of an odd length.", () => {
  assertThrows(() => {
    generateRandomHexString(3);
  });
});
