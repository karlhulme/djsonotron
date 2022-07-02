import { assertThrows } from "../../deps.ts";
import { FloatTypeDef } from "../interfaces/index.ts";
import { ensureJsonotronTypes } from "./ensureJsonotronTypes.ts";

Deno.test("Validate a set of types that produces no errors.", () => {
  const floatType: FloatTypeDef = {
    kind: "float",
    system: "test",
    name: "simpleFloat",
    summary: "A type used for testing.",
    minimum: 10,
    maximum: 12,
  };

  ensureJsonotronTypes([floatType]);
});

Deno.test("Validate a set of types that produces errors.", () => {
  const floatType: FloatTypeDef = {
    kind: "float",
    system: "test",
    name: "simpleFloat",
    summary: "A type used for testing.",
    minimum: 15, // min/max wrong way round
    maximum: 12,
  };

  assertThrows(() => ensureJsonotronTypes([floatType]));
});
