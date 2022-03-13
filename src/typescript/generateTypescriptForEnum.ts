import { EnumTypeDef } from "../interfaces/index.ts";

export function generateTypescriptForEnum(
  def: EnumTypeDef,
) {
  const enumValues = def.items
    .map((item) => `  "${item.value}"`)
    .join(",\n");

  return `
/**
 * An array of the values of the ${def.system}/${def.name} enum.
 */
export const ${def.system}${def.name}Values = [
${enumValues}
] as const

/**
 * ${def.summary}
 */
export type ${def.system}${def.name} = typeof ${def.system}${def.name}Values[keyof typeof ${def.system}${def.name}Values];
  `;
}
