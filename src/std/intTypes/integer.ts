import { IntTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const integer: IntTypeDef = {
  kind: "int",
  system: stdSystemName,
  name: "integer",
  pluralName: "integers",
  summary: `A 32-bit signed integer.`,
  minimum: -2147483648,
  maximum: 2147483647,
};
