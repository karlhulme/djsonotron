import { IntTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const positiveIntegerOrZero: IntTypeDef = {
  kind: "int",
  system: stdSystemName,
  name: "positiveIntegerOrZero",
  summary:
    `A positive integer, or zero, represented as a 32-bit signed integer.`,
  minimum: 0,
  maximum: 2147483647,
};
