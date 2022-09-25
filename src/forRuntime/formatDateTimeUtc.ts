import { formatDate } from "../../deps.ts";

/**
 * Returns a UTC date time string for the given date object.
 * @param date A date.
 */
export function formatDateTimeUtc(date: Date) {
  return formatDate(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}
