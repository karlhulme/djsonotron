import { assertEquals } from "../../deps.ts";
import { formatDateTimeUtc } from "./formatDateTimeUtc.ts";

Deno.test("Format a date and time.", () => {
  // Note that month is zero based, so month=6 refers to July (month 7).
  assertEquals(
    formatDateTimeUtc(new Date(2000, 6, 21, 19, 34, 12, 888)),
    "2000-07-21T19:34:12.888Z",
  );
});
