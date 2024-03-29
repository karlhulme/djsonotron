import { assert } from "../../deps.ts";
import { readJsonResourcesFromDirectory } from "./readJsonResourcesFromDirectory.ts";

Deno.test("Read json files, using the schemas directory for practice.", async () => {
  const testDir = new URL(".", import.meta.url).pathname;
  // The actual test resources are inside subfolders.
  const schemaDir = testDir.replace("/src/utils", "/test/resourceAssets");
  const resources = await readJsonResourcesFromDirectory(schemaDir);
  assert(resources.length > 0);
});
