import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const idWithPrefix: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "idWithPrefix",
  pluralName: "idsWithPrefix",
  summary:
    `An id with a prefix of 2 to 5 letters that identifies the type of object.  The subsequent
     characters should include an encoded date-time component so that codes
     can be stored sequentially and a random section.`,
  regex: "^[a-z]{2,5}_[a-zA-Z0-9]{4,44}$",
  maximumLength: 50,
  validTestCases: [{
    value: "ex_234g23jh534hgk35jhkjhk",
  }, {
    value: "ex_test",
  }, {
    value: "ex_system",
  }],
  invalidTestCases: [{
    value: "ex234g23jh534hgk35jhkjhk",
  }, {
    value: "ex_234g23jh534hgk_35jhkjhk",
  }],
};
