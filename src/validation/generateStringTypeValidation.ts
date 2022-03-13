import { StringTypeDef } from "../interfaces/index.ts";

interface StringTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: StringTypeDef;
}

export function generateStringTypeValidation(props: StringTypeValidationProps) {
  const typeCheck = `
    if (typeof ${props.valuePath} !== "string") {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        msg: "Should be a string.",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  const minLengthCheck = typeof props.def.minimumLength === "number"
    ? `
      if (${props.valuePath}.length < ${props.def.minimumLength}) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          msg: "Should have ${props.def.minimumLength} or more characters.",
          type: "${props.def.system}/${props.def.name}",
        })
      }     
    `
    : "";

  const maxLengthCheck = `
    if (${props.valuePath}.length > ${props.def.maximumLength}) {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        msg: "Should have ${props.def.maximumLength} or less characters.",
        type: "${props.def.system}/${props.def.name}",
      })
    }    
  `;

  const patternCheck = typeof props.def.regex === "string"
    ? `
      if (!/${props.def.regex}/.test(${props.valuePath})) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          msg: "Should match regex pattern ${props.def.regex}.",
          type: "${props.def.system}/${props.def.name}",
        })
      }      
    `
    : "";

  return `
    ${typeCheck} else {
      ${minLengthCheck}
      ${maxLengthCheck}
      ${patternCheck}
    }
  `;
}
