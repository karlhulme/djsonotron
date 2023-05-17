import { parseYaml } from "../../deps.ts";

/**
 * Returns an array, whereby each element is the value
 * retrieved from calling parseYaml on the contents of
 * each YAML file inside the given directory and any
 * sub-directories.
 * @param dir The directory path from the current working
 * directory to the target directory.  Do not include
 * a trailing slash.
 */
export async function readYamlResourcesFromDirectory(dir: string) {
  const resources: unknown[] = [];

  for await (const dirEntry of Deno.readDir(dir)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".json")) {
      const filename = dir + "/" + dirEntry.name;
      const fileContents = await Deno.readTextFile(filename);
      resources.push(parseYaml(fileContents, {}));
    }

    if (dirEntry.isDirectory) {
      const subResources = await readYamlResourcesFromDirectory(
        dir + "/" + dirEntry.name,
      );
      resources.push(...subResources);
    }
  }

  return resources;
}
