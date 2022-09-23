import { TypescriptTreeFunction } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateBoolTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Returns a typescript function definition for a bool type.
 * @param def A boolean type definition.
 */
export function generateValidateBoolTypeFunc(
  def: JsonotronTypeDef,
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateBoolTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
      })
    }
      return errors;
    `,
  };
}
