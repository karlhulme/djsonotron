import { IntTypeDef } from "../interfaces/index.ts";

interface IntTypeValidationProps {
  valuePath: string;
  def: IntTypeDef;
}

export function generateIntTypeValidation(props: IntTypeValidationProps) {
  return `
    if (typeof ${props.valuePath} !== 'number') {
      errors.push({
        valuePath: '${props.valuePath}',
        msg: 'Should be a number',
        typeSystem: '${props.def.system}',
        typeName: '${props.def.name}'
      })
    } else {
      if (!Number.isInteger(${props.valuePath})) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should be a whole number.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })        
      }

      if (${props.valuePath} < ${props.def.minimum}) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should be greater than or equal to ${props.def.minimum}.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }

      if (${props.valuePath} > ${props.def.maximum}) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should be less than or equal to ${props.def.maximum}.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }
    }
  `;
}
