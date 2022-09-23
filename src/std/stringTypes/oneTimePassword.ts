import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const oneTimePassword: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "oneTimePassword",
  pluralName: "oneTimePasswords",
  summary: `A 6 digit password.`,
  regex: "^[0-9]{6}$",
  maximumLength: 6,
  validTestCases: [{
    value: "123456",
  }],
  invalidTestCases: [{
    value: "12345",
  }, {
    value: "1234567",
  }, {
    value: "abcdef",
  }],
};
