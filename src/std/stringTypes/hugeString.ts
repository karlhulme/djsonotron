import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const hugeString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "hugeString",
  pluralName: "hugeStrings",
  summary: "A string with up to 4000 unicode characters.",
  maximumLength: 4000,
};
