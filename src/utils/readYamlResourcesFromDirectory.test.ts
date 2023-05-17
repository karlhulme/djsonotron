import { assert } from "../../deps.ts";
import { readYamlResourcesFromDirectory } from "./readYamlResourcesFromDirectory.ts";

Deno.test("Read yaml files, using the schemas directory for practice.", async () => {
  const testDir = new URL(".", import.meta.url).pathname;
  // The actual test resources are inside subfolders.
  const schemaDir = testDir.replace("/src/utils", "/test/resourceAssets");
  const resources = await readYamlResourcesFromDirectory(schemaDir);
  assert(resources.length > 0);
});
