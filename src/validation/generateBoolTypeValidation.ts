import { JsonotronTypeDef } from "../interfaces/index.ts";

interface BoolTypeValidationProps {
  valuePath: string;
  def: JsonotronTypeDef;
}

export function generateBoolTypeValidation(props: BoolTypeValidationProps) {
  return `
    if (typeof ${props.valuePath} !== 'boolean') {
      errors.push({
        valuePath: '${props.valuePath}',
        msg: 'Should be a boolean',
        typeSystem: '${props.def.system}',
        typeName: '${props.def.name}'
      })
    }
  `;
}
