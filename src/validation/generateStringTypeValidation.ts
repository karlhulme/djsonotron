import { StringTypeDef } from "../interfaces/index.ts";

interface StringTypeValidationProps {
  valuePath: string;
  def: StringTypeDef;
}

export function generateStringTypeValidation(props: StringTypeValidationProps) {
  return `
    if (typeof ${props.valuePath} !== 'string') {
      errors.push({
        valuePath: '${props.valuePath}',
        msg: 'Should be a string',
        typeSystem: '${props.def.system}',
        typeName: '${props.def.name}'
      })
    } else {
      ${typeof props.def.minimumLength === 'number' && `
      if (${props.valuePath}.length < ${props.def.minimumLength}) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should have ${props.def.minimumLength} or more characters.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }      
      `}

      if (${props.valuePath}.length > ${props.def.maximumLength}) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should have ${props.def.maximumLength} or less characters.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }  

      ${typeof props.def.regex === 'string' && `
      if (!/${props.def.regex}/.test(${props.valuePath}) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should match regex pattern ${props.def.regex}.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }      
      `}
    }
  `;
}
