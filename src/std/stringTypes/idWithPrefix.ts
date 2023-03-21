import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const idWithPrefix: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "idWithPrefix",
  pluralName: "idsWithPrefix",
  summary:
    `An id that identifies an object.  It is composed for 2 visible parts.
     The first part is a sequence of 2 to 6 lowercase letters that denote the type of object.
     The second part is a sequence of random characters that are based on the date
     and time.  Ids generated is this manner will be ordered chronilogically when ordered
     alphabetically.`,
  regex: "^[a-z]{2,6}_[a-z0-9]{4,44}$",
  maximumLength: 50,
  validTestCases: [{
    value: "ex_234g23jh534hgk35jhkjhk",
  }, {
    value: "ex_test",
  }, {
    value: "exampl_system",
  }],
  invalidTestCases: [{
    value: "ex234g23jh534hgk35jhkjhk",
  }, {
    value: "Xcaps_ex234g23jh534hgk35jhkjhk",
  }, {
    value: "toolong_234g23jh534hgk_35jhkjhk",
  }],
};
