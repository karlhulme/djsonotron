import { TypescriptTreeFunction } from "../../deps.ts";
import { getJsonotronTypeFormalName, JsonotronTypeDef } from "../index.ts";

/**
 * Generates the signature for a validation function.
 * @param def A Jsonotron type definition.
 */
export function generateValidateFunctionShell(
  def: JsonotronTypeDef,
): TypescriptTreeFunction {
  return {
    name: "validate" + getJsonotronTypeFormalName(def),
    comment:
      `Validate the given value to ensure it is a valid ${def.system}/${def.name}.`,
    params: [{
      name: "value",
      typeName: "any",
      comment: "The value to be validated.",
    }, {
      name: "valueDisplayPath",
      typeName: "string",
      comment: "The path to the value being validated.",
    }],
    returnType: "ValidationError[]",
    exported: true,
    lines: "",
  };
}
