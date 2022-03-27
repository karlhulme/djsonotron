import { StringTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateStringTypeValidation } from "../codegenValidationClauses/index.ts";

export function generateTypescriptForString(
  def: StringTypeDef,
) {
  return `
/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} string.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any, valueDisplayPath: string): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateStringTypeValidation({
      def,
      valueDisplayPath: "${valueDisplayPath}",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
