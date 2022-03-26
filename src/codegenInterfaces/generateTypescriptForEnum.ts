import { EnumTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateEnumTypeValidation } from "../codegenValidationFuncs/index.ts";

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

/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} enum.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateEnumTypeValidation({
      def,
      valueDisplayPath: "value",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
