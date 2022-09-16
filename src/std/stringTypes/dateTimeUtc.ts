import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const dateTimeUtc: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "dateTimeUtc",
  pluralName: "dateTimeUtcs",
  summary:
    `A string with the date and time components arranged using the YYYY-MM-DDTHH:mm:ss.zzzZ
    pattern. Leading zeroes must be used to ensure that all values are the same length.
    The string must always end with a Z to indicate that value is based on UTC and not
    an alternative time zone.
    The regex checks that numbers appear in the correct location but will not pickup invalid
    date/times like 2020-02-31T12:00:00.000Z.`,
  minimumLength: 24,
  maximumLength: 24,
  regex: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0-9]{3}Z$",
  validTestCases: [{
    value: "2020-01-01T12:00:00.000Z",
  }],
  invalidTestCases: [{
    value: "2020-01-01T12:00:00.000", // missing Z suffix
  }, {
    value: "2020-01-01T12:00:00.000+1:00", // disallowed time zone
  }],
};
