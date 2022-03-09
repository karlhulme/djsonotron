import { FloatTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const longitudeFloat: FloatTypeDef = {
  kind: "float",
  system: stdSystemName,
  name: "longitudeFloat",
  summary: `A value that represents a longitudinal position.`,
  minimum: -180,
  maximum: 180,
};
