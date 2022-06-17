import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateValidateArrayTypeFunc(
  def: JsonotronTypeDef,
) {
  return `
  /**
   * Validate the given array to ensure it is a valid array of ${def.system}/${def.name} bools.
   */
   export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  }Array (value: any, valueDisplayPath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
    if (Array.isArray(value)) {
      for (const element of value) {
        errors.push(
          ...validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  }(value, valueDisplayPath)
        )
      }
    } else {
      errors.push({
        valuePath: valueDisplayPath},
        value: value,
        msg: "Value must be an array.",
        type: "${def.system}/${def.name}[]",
      })
    }
  
  return errors;
  }
`;
}
