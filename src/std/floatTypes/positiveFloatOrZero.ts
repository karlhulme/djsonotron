import { FloatTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const positiveFloatOrZero: FloatTypeDef = {
  kind: "float",
  system: stdSystemName,
  name: "positiveFloatOrZero",
  pluralName: "positiveFloatsOrZeroes",
  summary:
    `A single precision floating point number in the range 0 to 3.4*10^38.`,
  minimum: 0,
  maximum: 340000000000000000000000000000000000000.0,
};
