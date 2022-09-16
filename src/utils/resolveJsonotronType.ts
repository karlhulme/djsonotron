import { JsonotronTypeDef } from "../interfaces/index.ts";
import { getSystemFromTypeString } from "./getSystemFromTypeString.ts";
import { getTypeFromTypeString } from "./getTypeFromTypeString.ts";

/**
 * Returns the Jsonotron type that matches the given type string.
 * @param typeString A type string in the format system/typeName.
 * @param types An array of Jsonotron types.
 */
export function resolveJsonotronType(
  typeString: string,
  types: JsonotronTypeDef[],
) {
  const typeSystem = getSystemFromTypeString(typeString);
  const typeName = getTypeFromTypeString(typeString);

  const result = types.find((t) =>
    t.system === typeSystem && t.name === typeName
  );

  if (!result) {
    throw new Error(`Unable to resolve type: ${typeString}.`);
  }

  return result;
}
