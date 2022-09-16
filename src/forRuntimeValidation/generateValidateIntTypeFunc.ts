import { TypescriptTreeFunction } from "../../deps.ts";
import { IntTypeDef } from "../interfaces/index.ts";
import { generateIntTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Return a typescript function definition for an int type.
 * @param def An int type definition.
 */
export function generateValidateIntTypeFunc(
  def: IntTypeDef,
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateIntTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
      })
    }
      return errors;
    `,
  };
}
