import { TypescriptTreeFunction } from "../../deps.ts";

/**
 * Returns a typescript function definition for an array that
 * typed variants can use.
 */
export function generateValidateArrayFunc(): TypescriptTreeFunction {
  return {
    name: "validateArray",
    returnType: "ValidationError[]",
    comment: "Validate an array.",
    exported: true,
    params: [{
      name: "value",
      typeName: "any",
      comment: "The value to be validated.",
    }, {
      name: "valueDisplayPath",
      typeName: "string",
      comment: "The path to the value being validated.",
    }, {
      name: "elementValidator",
      typeName: "(value: any, valueDisplayPath: string) => ValidationError[]",
      comment: "A function that validates each element in the array.",
    }, {
      name: "elementType",
      typeName: "string",
      comment: "The type of each element.",
    }],
    lines: `
      const errors: ValidationError[] = [];

      if (Array.isArray(value)) {
        for (let elementNo = 0; elementNo < value.length; elementNo++) {
          errors.push(
            ...elementValidator(
              value[elementNo],
              valueDisplayPath + "[" + elementNo + "]"
            )
          )
        }
      } else {
        errors.push({
          valuePath: valueDisplayPath,
          value: value,
          msg: "Value must be an array.",
          type: elementType + "[]",
        })
      }
    
      return errors;
    `,
  };
}
