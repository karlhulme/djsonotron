/**
 * Returns the given path but with non-alpha characters
 * replaced with an underscore.
 * @param valuePath A path to a value in an object tree.
 */
export function getSafeValuePath(valuePath: string) {
  return valuePath.replace(/[^a-zA-Z]/g, "_");
}
