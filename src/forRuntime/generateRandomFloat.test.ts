import { assert } from "../../deps.ts";
import { generateRandomFloat } from "./generateRandomFloat.ts";

Deno.test("Create a random float between zero and one.", () => {
  for (let i = 0; i < 1000; i++) {
    const f = generateRandomFloat();

    assert(f >= 0);
    assert(f < 1);
  }
});
