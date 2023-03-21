import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const idWithPrefix: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "idWithPrefix",
  pluralName: "idsWithPrefix",
  summary:
    `An id that identifies an object.  It is composed for 3 visible parts.
     The first part is an optional capital letter that is used to denote the category
     of an object, for example an 'N' for a normalised record, or a 'T' for a deep
     tree structure.  This optional letter is used for internal ids.  The second part
     is a sequence of 2 to 6 lowercase letters that denote the type of object.
     The final section is a sequence of random characters that are based on the date
     and time.  Ids generated is this manner will ordered chronilogically when ordered
     alphabetically.`,
  regex: "^[A-Z]?[a-z]{2,6}_[a-z0-9]{4,44}$",
  maximumLength: 50,
  validTestCases: [{
    value: "ex_234g23jh534hgk35jhkjhk",
  }, {
    value: "Nex_test",
  }, {
    value: "Texampl_system",
  }],
  invalidTestCases: [{
    value: "ex234g23jh534hgk35jhkjhk",
  }, {
    value: "XXcaps_ex234g23jh534hgk35jhkjhk",
  }, {
    value: "toolong_234g23jh534hgk_35jhkjhk",
  }],
};
