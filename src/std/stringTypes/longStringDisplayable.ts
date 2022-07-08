import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const longStringDisplayable: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "longStringDisplayable",
  summary:
    "A string with up to 250 unicode characters, and at least 1 alphanumeric character.",
  maximumLength: 250,
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
