import { formatDate as internalFormatDate } from "../../deps.ts";

/**
 * Returns a date string for the given date object.
 * @param date A ate.
 */
export function formatDate(date: Date) {
  return internalFormatDate(date, "yyyy-MM-dd");
}
