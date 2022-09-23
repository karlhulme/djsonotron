import { TypescriptTreeFunction } from "../../deps.ts";
import { StringTypeDef } from "../interfaces/index.ts";
import { generateStringTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Return a typescript function definition for a string type.
 * @param def A string type definition.
 */
export function generateValidateStringTypeFunc(
  def: StringTypeDef,
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateStringTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
      })
    }
      return errors;
    `,
  };
}
