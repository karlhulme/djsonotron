import { RecordTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const testRecord1: RecordTypeDef = {
  kind: "record",
  system: stdSystemName,
  name: "testRecord1",
  summary: `A record for testing the records and deprecations.`,
  deprecated: "This record is only used for testing.",
  properties: [{
    name: "first",
    propertyType: "std/positiveInteger",
    isArray: true,
    summary: "The first value.",
  }, {
    name: "second",
    propertyType: "std/dateTimeUtc",
    summary: "The second value.",
  }, {
    name: "third",
    propertyType: "std/shortString",
    constant: "333",
    summary: "The third value.",
  }],
  required: ["first", "second"],
  validTestCases: [{
    value: {
      first: "one",
      second: "two",
      third: "333",
    },
  }],
};
