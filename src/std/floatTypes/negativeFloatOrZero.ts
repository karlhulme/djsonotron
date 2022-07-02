import { FloatTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const negativeFloatOrZero: FloatTypeDef = {
  kind: "float",
  system: stdSystemName,
  name: "negativeFloatOrZero",
  summary:
    `A single precision floating point number in the range -1.1*10^38 to 0.`,
  minimum: -110000000000000000000000000000000000000.0,
  maximum: 0,
};
