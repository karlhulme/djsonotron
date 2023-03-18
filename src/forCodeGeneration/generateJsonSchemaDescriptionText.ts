/**
 * Returns the given summary text with the deprecation text attached if
 * the deprecated parameter is a string.
 * @param summary The summary of a field.
 * @param deprecated A message about the deprecation of the field.
 * @param propTypeSummary The summary of the type of the field.
 * @param isArray True if the schema defines an array type, and the
 * propTypeSummary applies to the individual elements of the array.
 */
export function generateJsonSchemaDescriptionText(
  summary: string,
  deprecated: string | null,
  propTypeSummary: string | null,
  isArray: boolean,
) {
  let result = summary;

  if (deprecated) {
    result += `\n\nDeprecated: ${deprecated}`;
  }

  if (propTypeSummary) {
    if (isArray) {
      result += `\n\n(Type: An array.  Element Type: ${propTypeSummary})`;
    } else {
      result += `\n\n(Type: ${propTypeSummary})`;
    }
  }

  return result;
}
