import { StringTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const dateTimeTz: StringTypeDef = {
  kind: "string",
  system: stdSystemName,
  name: "dateTimeTz",
  summary:
    `A string with the date and time components arranged using the YYYY-MM-DDTHH:mm:ss.zzz+00:00
    pattern. Leading zeroes must be used to ensure that all values are the same length.
    The string must always end with a time zone offset.
    The regex checks that numbers appear in the correct location but will not pickup invalid
    date/times like 2020-02-31T12:00:00.000+00:00.`,
  minimumLength: 29,
  maximumLength: 29,
  regex:
    "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0-9]{3}[+][0-9]{2}:[0-9]{2}$",
  validTestCases: [{
    value: "2020-01-01T12:00:00.000+00:00",
  }],
  invalidTestCases: [{
    value: "2020-01-01T12:00:00.000Z",
  }, {
    value: "2020-01-01T12:00:00.000+1:00",
  }],
};
