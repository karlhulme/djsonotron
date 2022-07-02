import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const date: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "date",
  pluralName: "dates",
  summary: `A date in the format YYYY-MM-DD.`,
  maximumLength: 45,
  regex: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
  validTestCases: [{
    value: "2022-04-18",
  }],
  invalidTestCases: [{
    value: "2022-4-18",
  }],
};
