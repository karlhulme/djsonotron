import { assert } from "../../deps.ts";
import { readJsonResourcesFromDirectory } from "./readJsonResourcesFromDirectory.ts";

Deno.test("Read json files, using the schemas directory for practice.", async () => {
  const testDir = new URL(".", import.meta.url).pathname;
  // We use the root, rather than the schemas folder, so that we can
  // exercise the recursive search as well.
  const schemaDir = testDir.replace("/src/utils", "");
  const resources = await readJsonResourcesFromDirectory(schemaDir);
  assert(resources.length > 0);
});
