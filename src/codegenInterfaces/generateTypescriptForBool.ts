import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateBoolTypeValidation } from "../codegenValidationFuncs/index.ts";

export function generateTypescriptForBool(
  def: JsonotronTypeDef,
) {
  return `
/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} bool.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateBoolTypeValidation({
      def,
      valueDisplayPath: "value",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
