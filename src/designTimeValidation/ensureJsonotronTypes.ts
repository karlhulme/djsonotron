import { JsonotronTypeDef } from "../interfaces/index.ts";
import { validateJsonotronTypes } from "./validateJsonotronTypes.ts";

/**
 * Raises an error if any of the given jsonotron types are invalid.
 * @param types An array of jsonotron types.
 */
export function ensureJsonotronTypes(types: JsonotronTypeDef[]) {
  const typeDefValidationErrors = validateJsonotronTypes(types);

  if (typeDefValidationErrors.length > 0) {
    throw new Error(
      `Type definition validation failed.\n${
        JSON.stringify(typeDefValidationErrors, null, 2)
      }`,
    );
  }
}
