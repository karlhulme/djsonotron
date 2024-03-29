import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const time: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "time",
  pluralName: "times",
  summary:
    `A string with the time components arranged using the HH:mm:ss pattern.  If
    the hours, minutes or seconds component is a value less than 10 then a leading zero
    must be included.  This ensures that all stored times are the same length.`,
  minimumLength: 8,
  maximumLength: 8,
  regex: "^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$",
  validTestCases: [{
    value: "16:30:00",
  }],
  invalidTestCases: [{
    value: "2:30",
  }, {
    value: "2:30:00",
  }],
};
