import { IntTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const timestamp: IntTypeDef = {
  kind: "int",
  system: stdSystemName,
  name: "timestamp",
  summary:
    `The number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970,
    represented as a 64-bit integer.`,
  minimum: 0,
  maximum: 9000000000000,
};
