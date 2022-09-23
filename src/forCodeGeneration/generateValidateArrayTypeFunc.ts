import { TypescriptTreeFunction } from "../../deps.ts";
import { getJsonotronTypeFormalName } from "../utils/index.ts";
import { JsonotronTypeDef } from "../interfaces/index.ts";

/**
 * Returns a typed typescript function definition for an array of Jsonotron types.
 * @param def A jsonotron type definition.
 */
export function generateValidateArrayTypeFunc(
  def: JsonotronTypeDef,
): TypescriptTreeFunction {
  return {
    name: "validate" + getJsonotronTypeFormalName(def) + "Array",
    comment:
      `Validate the given array to ensure it is a valid array of ${def.system}/${def.name} elements.`,
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
    lines: `return validateArray(value, valueDisplayPath, validate${
      getJsonotronTypeFormalName(def)
    }, "${def.system}/${def.name}")`,
  };
}
