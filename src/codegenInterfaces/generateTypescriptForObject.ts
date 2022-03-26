import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateObjectTypeValidation } from "../codegenValidationFuncs/index.ts";

export function generateTypescriptForObject(
  def: JsonotronTypeDef,
) {
  return `
/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} object.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateObjectTypeValidation({
      def,
      valueDisplayPath: "value",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
