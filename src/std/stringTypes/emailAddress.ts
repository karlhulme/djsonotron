import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const emailAddress: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "emailAddress",
  pluralName: "emailAddresses",
  summary:
    `The regex will check that an email address is in the common person@domain.tld format.`,
  regex: "^[^\\s]{1,64}@[^\\s]{1,245}[.][^\\s]{1,10}$",
  maximumLength: 320,
  validTestCases: [{
    value: "person@domain.com",
  }],
  invalidTestCases: [{
    value: "recipient",
  }, {
    value: "recipient@domain",
  }, {
    value: "recipient domain",
  }],
};
