import { IntTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateIntTypeValidation } from "../codegenValidationClauses/index.ts";

export function generateTypescriptForInt(
  def: IntTypeDef,
) {
  return `
/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} int.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any, valueDisplayPath: string): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateIntTypeValidation({
      def,
      valueDisplayPath: "${valueDisplayPath}",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
