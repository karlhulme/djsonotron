import { StringTypeDef } from "../interfaces/index.ts";
import { isValidRegex } from "../utils/index.ts";

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
        value: ${props.valuePath},
        msg: "Value must be a string.",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  const minLengthCheck = typeof props.def.minimumLength === "number"
    ? `
      if (${props.valuePath}.length < ${props.def.minimumLength}) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          value: ${props.valuePath},
          msg: "Value must have ${props.def.minimumLength} or more characters.",
          type: "${props.def.system}/${props.def.name}",
        })
      }     
    `
    : "";

  const maxLengthCheck = `
    if (${props.valuePath}.length > ${props.def.maximumLength}) {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        value: ${props.valuePath},
        msg: "Value must have ${props.def.maximumLength} or less characters.",
        type: "${props.def.system}/${props.def.name}",
      })
    }    
  `;

  const escapedRegex =
    typeof props.def.regex === "string" && isValidRegex(props.def.regex)
      ? props.def.regex.replaceAll("\\", "\\\\")
      : "";

  const patternCheck = escapedRegex.length > 0
    ? `
      const regex = new RegExp("${escapedRegex}")
      if (!regex.test(${props.valuePath})) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          value: ${props.valuePath},
          msg: "Value must match regex pattern ${escapedRegex}.",
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
