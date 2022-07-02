import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const uuid: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "uuid",
  summary:
    `A universally unique 128 bit number formatted as 32 alphanumeric characters
    and defined by RFC 4122.`,
  maximumLength: 36,
  regex: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
  validTestCases: [{
    value: "00000000-0000-0000-0000-000000000000",
  }],
  invalidTestCases: [{
    value: "00000000-0000-0000-0000-00000000000n",
  }, {
    value: "00000000-0000-0000-0000-00000000000", // too short
  }, {
    value: "00000000-0000-0000-0000-0000000000000", // too long
  }],
};
