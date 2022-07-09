import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

const userClaimRegex =
  "[a-zA-Z]+:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:[a-zA-Z]+";

export const userClaimsString: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "userClaim",
  maximumLength: 2000,
  summary: "A user claim in the form resourceType:resourceId:role.",
  regex: `^${userClaimRegex}( ${userClaimRegex})*$`,
  validTestCases: [{
    value:
      "club:00000000-0000-0000-0000-000000000000:support club:00000000-0000-0000-0000-000000000000:marketeer",
  }],
};
