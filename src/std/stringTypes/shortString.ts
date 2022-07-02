import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const shortString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "shortString",
  summary: "A string with up to 20 unicode characters.",
  maximumLength: 20,
};
