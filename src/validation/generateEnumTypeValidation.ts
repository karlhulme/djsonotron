import { EnumTypeDef } from "../interfaces/index.ts";

interface EnumTypeValidationProps {
  valuePath: string;
  def: EnumTypeDef;
}

export function generateEnumTypeValidation(props: EnumTypeValidationProps) {
  return `
    if (typeof ${props.valuePath} !== 'string') {
      errors.push({
        valuePath: '${props.valuePath}',
        msg: 'Should be a string',
        typeSystem: '${props.def.system}',
        typeName: '${props.def.name}'
      })
    } else {
      if (![${props.def.items.map(item => item.value).join(', ')}].includes(${props.valuePath})) {
        errors.push({
          valuePath: '${props.valuePath}',
          msg: 'Should be one of the enum values: ${props.def.items.map(item => item.value).join(', ')}.',
          typeSystem: '${props.def.system}',
          typeName: '${props.def.name}'
        })
      }
    }
  `;
}
