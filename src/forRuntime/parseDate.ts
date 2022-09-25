import { parseDate as internalParseDate } from "../../deps.ts";

/**
 * Returns a date object for the given date string.
 * @param dateString A date string.
 */
export function parseDate(dateString: string) {
  return internalParseDate(dateString, "yyyy-MM-dd");
}
