import { IntTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const negativeInteger: IntTypeDef = {
  kind: "int",
  system: stdSystemName,
  name: "negativeInteger",
  summary: `A negative integer represented as a 32-bit signed integer.`,
  minimum: -2147483648,
  maximum: -1,
};
