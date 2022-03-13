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
