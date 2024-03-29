import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const userClaim: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "userClaim",
  pluralName: "userClaims",
  maximumLength: 80,
  summary: `A user claim in the form resourceType:resourceId:role1,role2.`,
  regex:
    "^[a-zA-Z]+:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:[a-zA-Z]+(,[a-zA-Z]+)*$",
  validTestCases: [{
    value: "club:00000000-0000-0000-0000-000000000000:admin",
  }, {
    value: "club:00000000-0000-0000-0000-000000000000:admin,support",
  }],
};
