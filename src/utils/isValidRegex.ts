/**
 * Returns true if the regex expression can be parsed,
 * otherwise false.
 * @param pattern A regex expression.
 */
export function isValidRegex(pattern: string) {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}
