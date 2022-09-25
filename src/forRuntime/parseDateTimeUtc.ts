import { parseDate } from "../../deps.ts";

/**
 * Returns a date object for the given date string in UTC format.
 * @param dateString A date string.
 */
export function parseDateTimeUtc(dateString: string) {
  return parseDate(dateString, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}
