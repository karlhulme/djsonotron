import { getSafeValuePath } from "./getSafeValuePath.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("Get safe indexer variable from value path by removing non-alphas.", () => {
  assertEquals(getSafeValuePath("abc[4].path2[2].hello"), "abc____path_____hello");
});
