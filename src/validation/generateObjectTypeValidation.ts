import { JsonotronTypeDef } from "../interfaces/index.ts";

interface ObjectTypeValidationProps {
  valuePath: string;
  def: JsonotronTypeDef;
}

export function generateObjectTypeValidation(props: ObjectTypeValidationProps) {
  return `
    if (typeof ${props.valuePath} !== 'object' || ${props.valuePath} === 'null' || Array.isArray(${props.valuePath}) {
      errors.push({
        valuePath: '${props.valuePath}',
        msg: 'Should be an object (non null and not an array).',
        typeSystem: '${props.def.system}',
        typeName: '${props.def.name}'
      })
    }
  `;
}
