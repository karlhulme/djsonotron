import { FloatTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const float: FloatTypeDef = {
  kind: "float",
  system: stdSystemName,
  name: "float",
  pluralName: "floats",
  summary:
    `A single precision floating point number in the range -1.1*10^38 to 3.4*10^38.
    This value can be accomodated by most programming languages using their native
    8-byte float type.`,
  minimum: -110000000000000000000000000000000000000.0,
  maximum: 340000000000000000000000000000000000000.0,
};
