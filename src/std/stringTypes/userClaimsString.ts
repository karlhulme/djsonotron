import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

const userClaimRegex =
  "[a-zA-Z]+:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:[a-zA-Z]+(,[a-zA-Z]+)*";

export const userClaimsString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "userClaimsString",
  pluralName: "userClaimsStrings",
  maximumLength: 1000,
  summary:
    "A set of user claims in the form resourceType:resourceId:role1,role2 seperated by a space.",
  regex: `^${userClaimRegex}( ${userClaimRegex})*$`,
  validTestCases: [{
    value:
      "club:00000000-0000-0000-0000-000000000000:support club:00000000-0000-0000-0000-000000000001:marketeer,designer",
  }],
};
