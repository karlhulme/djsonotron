import { RecordTypeDef } from "../interfaces/index.ts";

interface RecordTypeValidationProps {
  valuePath: string;
  def: RecordTypeDef;
}

export function generateRecordTypeValidation(props: RecordTypeValidationProps) {
  return `
    if (typeof ${props.valuePath} !== 'object' || ${props.valuePath} === null || Array.isArray(${props.valuePath})) {
      errors.push({
        valuePath: '${props.valuePath}',
        msg: 'Should be an object (non null and not an array).',
        typeSystem: '${props.def.system}',
        typeName: '${props.def.name}'
      })
    } else {
      const keys = Object.keys(${props.valuePath})

      ${
    Array.isArray(props.def.required) && props.def.required.map((req) => `
        if (typeof ${props.valuePath}.${req} === 'undefined' || ${props.valuePath}.${req} === null) {
          errors.push({
            valuePath: '${props.valuePath}.${req}',
            msg: 'Is a required property.',
            typeSystem: '${props.def.system}',
            typeName: '${props.def.name}'
          })
        }     
      `).join("\n")
  }

      // check out the individual properties and handle arrays
    }
  `;
}
