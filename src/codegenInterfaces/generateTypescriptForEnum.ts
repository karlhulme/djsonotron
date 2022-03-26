import { EnumTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateTypescriptForEnum(
  def: EnumTypeDef,
) {
  const enumValues = def.items
    .map((item) => `  "${item.value}"`)
    .join(",\n");

  return `
/**
 * An array of the values of the ${def.system}/${
    capitalizeFirstLetter(def.name)
  } enum.
 */
export const ${def.system}${capitalizeFirstLetter(def.name)}Values = [
${enumValues}
] as const

/**
 * ${def.summary}
 */
export type ${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } = typeof ${def.system}${
    capitalizeFirstLetter(def.name)
  }Values[keyof typeof ${def.system}${capitalizeFirstLetter(def.name)}Values];
  `;
}
