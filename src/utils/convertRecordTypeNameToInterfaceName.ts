import { capitalizeFirstLetter } from "./capitalizeFirstLetter.ts";
import { getSystemFromTypeString } from "./getSystemFromTypeString.ts";
import { getTypeFromTypeString } from "./getTypeFromTypeString.ts";

export function convertRecordTypeNameToInterfaceName(
  typeString: string,
  defaultSystem?: string,
) {
  const system = getSystemFromTypeString(typeString, defaultSystem);
  const name = getTypeFromTypeString(typeString);

  return `${capitalizeFirstLetter(system)}${capitalizeFirstLetter(name)}`;
}
