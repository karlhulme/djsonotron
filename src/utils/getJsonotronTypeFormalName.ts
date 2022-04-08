import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter.ts";

/**
 * Returns the fully-qualified and capitalised name of
 * the given Jsonotron record type.
 * @param type A jsonotron type.
 */
export function getJsonotronTypeFormalName(type: JsonotronTypeDef) {
  return `${capitalizeFirstLetter(type.system)}${
    capitalizeFirstLetter(type.name)
  }`;
}
