import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const time: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "time",
  summary:
    `A string with the time components arranged using the HH:mm:ss pattern.  If
    the hours, minutes or seconds component is a value less than 10 then a leading zero
    must be included.  This ensures that all stored times are the same length.`,
  minimumLength: 8,
  maximumLength: 8,
  regex:
    "^([0-9A-Fa-f]{0,4}:){2,7}([0-9A-Fa-f]{1,4}$|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4})$",
  validTestCases: [{
    value: "2a00:23c5:1ab0:3001:1776:5ae:499f:114a",
  }, {
    value: "::1",
  }],
  invalidTestCases: [{
    value: "2a00:23c5",
  }],
};
