import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const maxString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "maxString",
  summary: "A string with up to 4000 unicode characters.",
  maximumLength: 10000000, // 10 Million characters
};
