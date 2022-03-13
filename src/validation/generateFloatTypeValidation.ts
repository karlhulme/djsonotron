import { FloatTypeDef } from "../interfaces/index.ts";

interface FloatTypeValidationProps {
  valuePath: string;
  def: FloatTypeDef;
}

export function generateFloatTypeValidation(props: FloatTypeValidationProps) {
  return `
    if (typeof ${props.valuePath} !== 'number') {
      errors.push({
        valuePath: '${props.valuePath}',
        msg: 'Should be a number',
        typeSystem: '${props.def.system}',
        typeName: '${props.def.name}'
      })
    } else {
      if (${props.valuePath} ${
    props.def.isMinimumExclusive ? "<=" : "<"
  } ${props.def.minimum}) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should be greater than${
    props.def.isMinimumExclusive ? "" : " or equal to"
  } ${props.def.minimum}.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }

      if (${props.valuePath} ${
    props.def.isMaximumExclusive ? ">=" : "<"
  }  ${props.def.maximum}) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should be less than${
    props.def.isMaximumExclusive ? "" : " or equal to"
  } ${props.def.maximum}.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }
    }
  `;
}
