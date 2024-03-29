import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const ipv4: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "ipv4",
  pluralName: "ipv4s",
  summary:
    `A string of digits that identify a computer on a network in IP v4 format.
    The regex is an approximation and further validation may be desired.`,
  minimumLength: 5,
  maximumLength: 15,
  regex:
    "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
  validTestCases: [{
    value: "192.168.0.1",
  }],
  invalidTestCases: [{
    value: "255.255.255.256",
  }, {
    value: "1.1.1",
  }],
};
