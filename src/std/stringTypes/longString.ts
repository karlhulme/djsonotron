import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const longString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "longString",
  pluralName: "longStrings",
  summary: "A string with up to 250 unicode characters.",
  maximumLength: 250,
};
