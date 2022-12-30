/**
 * Returns an array, whereby each element is the value
 * retrieved from calling JSON.parse on the contents of
 * each JSON file.
 * @param dir The directory path from the current working
 * directory to the target directory.  Do not include
 * a trailing slash.
 */
export async function readJsonResourcesFromDirectory(dir: string) {
  const resources: unknown[] = [];

  for await (const dirEntry of Deno.readDir(dir)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".json")) {
      const filename = dir + "/" + dirEntry.name;
      const fileContents = await Deno.readTextFile(filename);
      resources.push(JSON.parse(fileContents));
    }
  }

  return resources;
}
