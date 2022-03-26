import { FloatTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateFloatTypeValidation } from "../codegenValidationFuncs/index.ts";

export function generateTypescriptForFloat(
  def: FloatTypeDef,
) {
  return `
/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} float.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateFloatTypeValidation({
      def,
      valueDisplayPath: "value",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
