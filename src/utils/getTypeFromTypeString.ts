/**
 * Returns the type name from the given type string.
 * @param typeString A type string in the format system/typeName
 */
export function getTypeFromTypeString(typeString: string) {
  const slashIndex = typeString.indexOf("/");

  if (slashIndex === -1) {
    return typeString;
  } else {
    return typeString.slice(slashIndex + 1);
  }
}
