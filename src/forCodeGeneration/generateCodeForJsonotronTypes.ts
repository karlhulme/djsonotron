import { generateTypescript, newTypescriptTree } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { appendJsonotronTypesToTree } from "./appendJsonotronTypesToTree.ts";

/**
 * Returns a typescript tree.
 * @param types An array of Jsonotron type definitions.
 * @param componentSchemasPath The path where the component schemas will be placed
 * and can be referenced from.
 */
export function generateCodeForJsonotronTypes(
  types: JsonotronTypeDef[],
  componentSchemasPath = "#/components/schemas/",
) {
  const tree = newTypescriptTree();

  appendJsonotronTypesToTree(tree, types, componentSchemasPath);

  return generateTypescript(tree);
}
