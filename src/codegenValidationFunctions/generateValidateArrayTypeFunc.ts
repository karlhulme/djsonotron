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
    return validateArray(value, valueDisplay, validate${capitalizeFirstLetter(def.system)}${
      capitalizeFirstLetter(def.name)
    }, "${def.system}/${def.name}")
  }
`;
}
