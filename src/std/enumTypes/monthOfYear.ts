import { EnumTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const monthOfYear: EnumTypeDef = {
  kind: "enum",
  system: stdSystemName,
  name: "monthOfYear",
  pluralName: "monthsOfYear",
  summary: "A month of the year.",
  items: [
    { value: "jan" },
    { value: "feb" },
    { value: "mar" },
    { value: "apr" },
    { value: "may" },
    { value: "jun" },
    { value: "jul" },
    { value: "aug" },
    { value: "sep" },
    { value: "oct" },
    { value: "nov" },
    { value: "dec" },
  ],
};
