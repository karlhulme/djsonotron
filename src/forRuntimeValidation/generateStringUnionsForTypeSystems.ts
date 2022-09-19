import { TypescriptTreeStringUnion } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

/**
 * Returns an array of string unions, one for each system.
 * @param types An array of jsonotron types.
 */
export function generateStringUnionsForTypeSystems(
  types: JsonotronTypeDef[],
): TypescriptTreeStringUnion[] {
  const result: TypescriptTreeStringUnion[] = [];

  const systemNames = types.map((t) => t.system);
  const uniqueSystemNames = [...new Set(systemNames)];

  for (const uniqueSystemName of uniqueSystemNames) {
    result.push({
      name: capitalizeFirstLetter(uniqueSystemName) + "TypeNames",
      comment:
        `The names of all the types defined in the ${uniqueSystemName} system.`,
      exported: true,
      values: types
        .filter((t) => t.system === uniqueSystemName)
        .map((t) => t.name),
    });
  }

  return result;
}
