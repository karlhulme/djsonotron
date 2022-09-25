import { assertEquals } from "../../deps.ts";
import { parseDateTimeUtc } from "./parseDateTimeUtc.ts";

Deno.test("Parse a date and time in UTC format.", () => {
  // Note that month is zero based, so month=6 refers to July (month 7).
  assertEquals(
    parseDateTimeUtc("2000-07-21T19:34:12.888Z"),
    new Date(2000, 6, 21, 19, 34, 12, 888),
  );
});
