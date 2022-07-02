import { assertStrictEquals, assertThrows } from "../../deps.ts";
import { createValidationFunction } from "./createValidationFunction.ts";

Deno.test("Create a validation function with a valid body.", () => {
  const fn = createValidationFunction("console.log(value);");
  assertStrictEquals(typeof fn === "function", true);
});

Deno.test("Fail to create validation function if body is invalid.", () => {
  assertThrows(
    () => createValidationFunction("invalid function body"),
    Error,
    "Unexpected token",
  );
});
