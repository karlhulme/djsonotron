import { assert } from "../../deps.ts";
import { readJsonResourcesFromDirectory } from "./readJsonResourcesFromDirectory.ts";

Deno.test("Read json files, using the schemas directory for practice.", async () => {
  const testDir = new URL(".", import.meta.url).pathname;
  const schemaDir = testDir.replace("/src/utils", "/schemas");
  console.log(schemaDir);
  const resources = await readJsonResourcesFromDirectory(schemaDir);
  assert(resources.length > 0);
});
