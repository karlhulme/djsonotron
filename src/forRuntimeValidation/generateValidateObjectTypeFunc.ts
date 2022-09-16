import { TypescriptTreeFunction } from "../../deps.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";
import { generateObjectTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Return a typescript function definition for an object type.
 * @param def An object type definition.
 */
export function generateValidateObjectTypeFunc(
  def: JsonotronTypeDef,
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateObjectTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
      })
    }
      return errors;
    `,
  };
}
