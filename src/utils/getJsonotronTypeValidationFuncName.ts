import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter.ts";

/**
 * Returns the name of the validation function for a Jsonotron type.
 * @param type A jsonotron type.
 * @param isArray True if the array version of the validation function
 * should be returned.
 */
export function getJsonotronTypeValidationFuncName(
  type: JsonotronTypeDef,
  isArray: boolean,
) {
  return `validate${capitalizeFirstLetter(type.system)}${
    capitalizeFirstLetter(type.name)
  }${isArray ? "Array" : ""}`;
}
