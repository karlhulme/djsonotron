export function generateValidateArrayFunc () {
  return `
    export function validateArray (
      value: any,
      valueDisplayPath: string,
      elementValidator: (value: any, valueDisplayPath: string): ValidationError[],
      elementType: string
    ): ValidationError[] {
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
    }
  `
}
