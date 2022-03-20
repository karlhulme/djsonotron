import { assertStrictEquals } from "../../deps.ts";
import { isValidRegex } from "./isValidRegex.ts";

Deno.test("Recognise a valid regex expression.", () => {
  assertStrictEquals(isValidRegex("[a-z]*"), true);
});

Deno.test("Recognise an invalid regex expression.", () => {
  assertStrictEquals(isValidRegex("!@£$%^&*()(*&^%$£@!@£$%^&*()"), false);
});
