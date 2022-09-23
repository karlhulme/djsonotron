import { JsonotronTypeDef } from "../interfaces/index.ts";
import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

/**
 * Returns a constant declaration containins all the exported runtime types.
 * @param types An array of jsonotron type defs.
 */
export function generateAllRuntimeTypesDeclaration(
  types: JsonotronTypeDef[],
): TypescriptTreeConstDeclaration {
  const exportedTypeNames: string[] = [];

  for (const type of types) {
    const singular = `${type.system}${capitalizeFirstLetter(type.name)}Type`;
    const plural = `${type.system}${capitalizeFirstLetter(type.name)}ArrayType`;

    exportedTypeNames.push(singular);
    exportedTypeNames.push(plural);
  }

  return {
    name: "allRuntimeTypes",
    comment: "An array of runtime types.",
    typeName: "JsonotronRuntimeType[]",
    exported: true,
    value: `[${
      exportedTypeNames.join(
        ", ",
      )
    }]`,
    outputGeneration: 1,
  };
}
