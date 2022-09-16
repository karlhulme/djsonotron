import { TypescriptTreeFunction } from "../../deps.ts";
import { FloatTypeDef } from "../interfaces/index.ts";
import { generateFloatTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Return a typescript function definition for a float type.
 * @param def A float type definition.
 */
export function generateValidateFloatTypeFunc(
  def: FloatTypeDef,
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateFloatTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
      })
    }
      return errors;
    `,
  };
}
