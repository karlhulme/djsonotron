/**
 * Returns a typescript import line that imports the given types from the given
 * source file with any duplicates removed.  If the type list is empty then an
 * empty string is returned.
 * @param types An array of types to be imported.
 * @param source The relative path to the source file where the imports are defined.
 * @returns
 */
export function generateTypescriptImportLine(types: string[], source: string) {
  const uniqueTypes = [...new Set(types)];

  if (uniqueTypes.length === 0) {
    return "";
  } else {
    return `import { ${uniqueTypes.join(", ")} } from "${source}";`;
  }
}
