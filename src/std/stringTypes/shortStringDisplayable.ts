import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const shortStringDisplayable: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "shortStringDisplayable",
  pluralName: "shortStringDisplayables",
  summary:
    "A string with up to 20 unicode characters, and at least 1 alphanumeric character.",
  maximumLength: 20,
  regex: "[A-Za-z0-9]+",
  validTestCases: [{
    value: "1",
    summary: "Contains an alpha numberic.",
  }],
  invalidTestCases: [{
    value: " ",
    summary: "Contains no alpha numerics.",
  }, {
    value: "",
    summary: "Contains no characters.",
  }],
};
