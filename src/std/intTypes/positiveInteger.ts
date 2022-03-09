import { IntTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const positiveInteger: IntTypeDef = {
  kind: "int",
  system: stdSystemName,
  name: "positiveInteger",
  summary: `A positive integer represented as a 32-bit signed integer.`,
  minimum: 1,
  maximum: 2147483647,
};
