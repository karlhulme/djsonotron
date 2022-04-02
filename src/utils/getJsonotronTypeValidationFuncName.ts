import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter.ts";

/**
 * Returns the name of the validation function for a Jsonotron type.
 * @param type A jsonotron type.
 */
export function getJsonotronTypeValidationFuncName(type: JsonotronTypeDef) {
  return `validate${capitalizeFirstLetter(type.system)}${
    capitalizeFirstLetter(type.name)
  }`;
}
