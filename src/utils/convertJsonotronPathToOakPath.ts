export function convertJsonotronPathToOakPath(path: string) {
  return path.replaceAll(/{[^:{}]+:[^:{}]+}/g, (subString) => {
    return ":" + subString.slice(1).split(":")[0];
  });
}
