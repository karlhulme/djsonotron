import { IntTypeDef } from "../interfaces/index.ts";

interface IntTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: IntTypeDef;
}

export function generateIntTypeValidation(props: IntTypeValidationProps) {
  const typeCheck = `
    if (typeof ${props.valuePath} !== "number") {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        value: ${props.valuePath},
        msg: "Value must be a number.",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  const wholeNumberCheck = `
    if (!Number.isInteger(${props.valuePath})) {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        value: ${props.valuePath},
        msg: "Value must be a whole number.",
        type: "${props.def.system}/${props.def.name}",
      })        
    }
  `;

  const minimumCheck = `
    if (${props.valuePath} < ${props.def.minimum}) {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        value: ${props.valuePath},
        msg: "Value must be greater than or equal to ${props.def.minimum}.",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  const maximumCheck = `
  if (${props.valuePath} > ${props.def.maximum}) {
    errors.push({
      valuePath: \`${props.valueDisplayPath}\`,
      value: ${props.valuePath},
      msg: "Values must be less than or equal to ${props.def.maximum}.",
      type: "${props.def.system}/${props.def.name}",
    })
  }
`;

  return `
    ${typeCheck} else {
      ${wholeNumberCheck}
      ${minimumCheck}
      ${maximumCheck}
    }
  `;
}
