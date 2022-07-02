import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const mediumString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "mediumString",
  summary: "A string with up to 50 unicode characters.",
  maximumLength: 50,
};
