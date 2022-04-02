import { JsonotronTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter.ts";

/**
 * Returns the interface name of a Jsonotron record type.
 * @param type A jsonotron type.
 */
export function getJsonotronTypeInterfaceName(type: JsonotronTypeDef) {
  if (type.kind === "record") {
    return `${capitalizeFirstLetter(type.system)}${
      capitalizeFirstLetter(type.name)
    }`;
  } else {
    throw new Error(`Type ${type.system}/${type.name} is not a record type.`);
  }
}
