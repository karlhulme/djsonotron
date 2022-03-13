import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const date: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "date",
  summary:
    `A string of digits that identify a computer on a network in IP v6 format.
    It will match values such as ::1 and 2a00:23c5:1ab0:3001:1776:5ae:499f:114a.
    The regex is an approximation and further validation may be desired.`,
  maximumLength: 45,
  regex: "^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$",
  validTestCases: [{
    value: "16:30:00",
  }],
  invalidTestCases: [{
    value: "16:30",
  }],
};
