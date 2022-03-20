export function getTypeFromTypeString(typeString: string) {
  const slashIndex = typeString.indexOf("/");

  if (slashIndex === -1) {
    return typeString;
  } else {
    return typeString.slice(slashIndex + 1);
  }
}
