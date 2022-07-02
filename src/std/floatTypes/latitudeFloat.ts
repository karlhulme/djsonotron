import { FloatTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const latitudeFloat: FloatTypeDef = {
  kind: "float",
  system: stdSystemName,
  name: "latitudeFloat",
  pluralName: "latitudeFloats",
  summary: `A value that represents a latitudinal position.`,
  minimum: -90,
  maximum: 90,
};
