import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const hugeStringDisplayable: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "hugeStringDisplayable",
  summary:
    "A string with up to 4000 unicode characters, and at least 1 alphanumeric character.",
  maximumLength: 4000,
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
