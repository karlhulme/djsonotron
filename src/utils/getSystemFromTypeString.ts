/**
 * Returns the system from the given type string.
 * @param typeString The type string in the format system/typeName.
 * @param defaultSystem The system name to assume if the system
 * name is missing.
 */
export function getSystemFromTypeString(
  typeString: string,
  defaultSystem?: string,
) {
  const slashIndex = typeString.indexOf("/");

  if (slashIndex === -1) {
    return defaultSystem || "std";
  } else {
    return typeString.slice(0, slashIndex);
  }
}
