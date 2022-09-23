import {
  TypescriptTreeEnumConstArray,
  TypescriptTreeFunction,
} from "../../deps.ts";
import { getJsonotronTypeFormalName } from "../utils/index.ts";
import { EnumTypeDef } from "../interfaces/index.ts";
import { generateEnumTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Returns an enum const array for a enum type.
 * @param def An enum type definition.
 */
export function generateEnumTypeEnumConstArray(
  def: EnumTypeDef,
): TypescriptTreeEnumConstArray {
  return {
    name: getJsonotronTypeFormalName(def),
    comment: `An array of the values of the ${def.system}/${def.name} enum.`,
    exported: true,
    values: def.items.map((item) => item.value),
  };
}

/**
 * Returns a typescript function definition for an enum type.
 * @param def An enum type definition.
 */
export function generateValidateEnumTypeFunc(
  def: EnumTypeDef,
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateEnumTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
      })
    }
      return errors;
    `,
  };
}
