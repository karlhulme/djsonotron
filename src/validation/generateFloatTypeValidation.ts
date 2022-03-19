import { FloatTypeDef } from "../interfaces/index.ts";

interface FloatTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: FloatTypeDef;
}

export function generateFloatTypeValidation(props: FloatTypeValidationProps) {
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

  const minimumEqualitySymbol = props.def.isMinimumExclusive ? "<=" : "<";
  const minimumMessage = `Value must be greater than${
    props.def.isMinimumExclusive ? "" : " or equal to"
  } ${props.def.minimum}.`;

  const minimumCheck = `
    if (${props.valuePath} ${minimumEqualitySymbol} ${props.def.minimum}) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          value: ${props.valuePath},
          msg: "${minimumMessage}",
          type: "${props.def.system}/${props.def.name}",
        })
      }
  `;

  const maximumEqualitySymbol = props.def.isMaximumExclusive ? ">=" : ">";
  const maximumMessage = `Value must be less than${
    props.def.isMaximumExclusive ? "" : " or equal to"
  } ${props.def.maximum}.`;

  const maximumCheck = `
    if (${props.valuePath} ${maximumEqualitySymbol} ${props.def.maximum}) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          value: ${props.valuePath},
          msg: "${maximumMessage}",
          type: "${props.def.system}/${props.def.name}",
        })
      }
  `;

  return `
    ${typeCheck} else {
      ${minimumCheck}
      ${maximumCheck}
    }
  `;
}
