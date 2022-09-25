import { assertEquals } from "../../deps.ts";
import { parseDate } from "./parseDate.ts";

Deno.test("Parse a date in UTC format.", () => {
  // Note that month is zero based, so month=6 refers to July (month 7).
  assertEquals(
    parseDate("2000-07-21"),
    new Date(2000, 6, 21),
  );
});
