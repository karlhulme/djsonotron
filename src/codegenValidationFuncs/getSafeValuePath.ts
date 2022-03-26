export function getSafeValuePath(valuePath: string) {
  return valuePath.replace(/[^a-zA-Z]/g, "_");
}
