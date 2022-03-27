import { FloatTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateFloatTypeValidation } from "../codegenValidationClauses/index.ts";

export function generateTypescriptForFloat(
  def: FloatTypeDef,
) {
  return `
/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} float.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any, valueDisplayPath: string): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateFloatTypeValidation({
      def,
      valueDisplayPath: "${valueDisplayPath}",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
