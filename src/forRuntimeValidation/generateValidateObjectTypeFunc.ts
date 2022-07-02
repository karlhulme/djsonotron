import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateObjectTypeValidation } from "../validationClauses/index.ts";

export function generateValidateObjectTypeFunc(
  def: JsonotronTypeDef,
) {
  return `
/**
 * Validate the given value to ensure it is a valid ${def.system}/${def.name} object.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any, valueDisplayPath: string): ValidationError[] {
const errors: ValidationError[] = [];
${
    generateObjectTypeValidation({
      def,
      valueDisplayPath: "${valueDisplayPath}",
      valuePath: "value",
    })
  }
return errors;
}
`;
}
