import { EnumTypeDef } from "../interfaces/index.ts";

interface EnumTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: EnumTypeDef;
}

export function generateEnumTypeValidation(props: EnumTypeValidationProps) {
  const typeCheck = `
    if (typeof ${props.valuePath} !== "string") {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        msg: "Should be a string.",
        type: "${props.def.system}/${props.def.name}",
      })
    } 
  `;

  const enumValuesDec = props.def.items
    .map((item) => `"${item.value}"`)
    .join(", ");

  const enumValuesText = props.def.items
    .map((item) => item.value)
    .join(", ");

  const oneOfEnumValuesCheck = `
    if (![${enumValuesDec}].includes(${props.valuePath})) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          msg: "Should be one of the enum values: ${enumValuesText}.",
          type: "${props.def.system}/${props.def.name}",
        })
      }
    }
  `;

  return `
    ${typeCheck} else {
      ${oneOfEnumValuesCheck}
    }
  `;
}
