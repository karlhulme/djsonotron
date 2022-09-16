import { IntTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const negativeIntegerOrZero: IntTypeDef = {
  kind: "int",
  system: stdSystemName,
  name: "negativeIntegerOrZero",
  pluralName: "negativeIntegersOrZeroes",
  summary:
    `A negative integer, or zero, represented as a 32-bit signed integer.`,
  minimum: -2147483648,
  maximum: 0,
};
