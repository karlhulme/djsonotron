import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const ipv6: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "ipv6",
  summary:
    `A string of digits that identify a computer on a network in IP v4 format.
    The regex is an approximation and further validation may be desired.`,
  maximumLength: 45,
  regex:
    "^([0-9A-Fa-f]{0,4}:){2,7}([0-9A-Fa-f]{1,4}$|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){4})$",
  validTestCases: [{
    value: "2a00:23c5:1ab0:3001:1776:5ae:499f:114a",
  }, {
    value: "::1",
  }],
  invalidTestCases: [{
    value: "2a00:23c5",
  }],
};
