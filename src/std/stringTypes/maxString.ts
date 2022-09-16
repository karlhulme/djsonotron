import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const maxString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "maxString",
  pluralName: "maxStrings",
  summary: "A string with up to 10 million unicode characters.",
  maximumLength: 10000000, // 10 Million characters
};
