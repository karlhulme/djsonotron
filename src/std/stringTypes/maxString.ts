import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const maxString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "maxString",
  pluralName: "maxStrings",
  summary:
    "A string with up to 1 million unicode characters.  A full string will require around 2MB of storage.",
  maximumLength: 1000000, // 1 Million characters
};
