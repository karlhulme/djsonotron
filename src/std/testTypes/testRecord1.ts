import { RecordTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const testRecord1: RecordTypeDef = {
  kind: "record",
  system: stdSystemName,
  name: "testRecord1",
  summary: `A record for testing the records and deprecations.`,
  deprecated: "This record is only used for testing.",
  properties: [{
    name: "theFirst",
    summary: "The first property.",
    propertyType: "shortString",
  }, {
    name: "theSecond",
    summary: "The second property.",
    propertyType: "shortString",
  }, {
    name: "theThird",
    summary: "The third property.",
    propertyType: "shortString",
    deprecated:
      "This third property is not used, please refer to theSecond instead.",
  }],
  required: [
    "theFirst",
    "theSecond",
  ],
  validTestCases: [{
    value: {
      theFirst: "one",
      theSecond: "two",
    },
  }],
};
