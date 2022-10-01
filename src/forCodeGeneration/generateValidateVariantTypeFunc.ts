import { TypescriptTreeFunction } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateVariantTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Return a typescript function definition for a variant type.
 * @param def A variant type definition.
 */
export function generateValidateVariantTypeFunc(
  def: JsonotronTypeDef,
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateVariantTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
      })
    }
      return errors;
    `,
  };
}
