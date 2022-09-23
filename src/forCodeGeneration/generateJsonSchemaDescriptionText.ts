/**
 * Returns the given summary text with the deprecation text attached if
 * the deprecated parameter is a string.
 * @param summary The summary of a type or field.
 * @param deprecated A message about the deprecation of the type of field.
 */
export function generateJsonSchemaDescriptionText(
  summary: string,
  deprecated?: string,
) {
  let result = summary;

  if (deprecated) {
    result += `\n\nDeprecated: ${deprecated}`;
  }

  return result;
}
