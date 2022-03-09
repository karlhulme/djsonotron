import { FloatTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const positiveFloat: FloatTypeDef = {
  kind: "float",
  system: stdSystemName,
  name: "positiveFloat",
  summary:
    `A single precision floating point number in the range just over 0 to 3.4*10^38.`,
  minimum: 0,
  maximum: 340000000000000000000000000000000000000,
  isMinimumExclusive: true,
};
