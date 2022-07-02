import { JsonotronTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const bool: JsonotronTypeDef = {
  kind: "bool",
  system: stdSystemName,
  name: "bool",
  summary: "A value of either true or false.",
};
