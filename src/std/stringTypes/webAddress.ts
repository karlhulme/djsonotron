import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const webAddress: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "webAddress",
  summary: `A url that is prefixed with either http or https.`,
  maximumLength: 2048,
  regex: "^http[s]?://[a-zA-Z0-9@:%._+~#=.?&/*()-]+$",
  validTestCases: [{
    value: "https://www.bbc.co.uk",
  }, {
    value: "http://localhost",
  }, {
    value: "http://localhost/path/to/file?with_parenthesis(16).png",
  }],
  invalidTestCases: [{
    value: "ftp://some-server.com",
  }, {
    value: "mailto:recipient@domain.com",
  }],
};
