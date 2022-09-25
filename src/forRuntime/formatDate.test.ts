import { assertEquals } from "../../deps.ts";
import { formatDate } from "./formatDate.ts";

Deno.test("Format a date.", () => {
  // Note that month is zero based, so month=6 refers to July (month 7).
  assertEquals(
    formatDate(new Date(2000, 6, 21)),
    "2000-07-21",
  );
});
