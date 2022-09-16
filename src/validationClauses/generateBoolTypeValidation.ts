import { JsonotronTypeDef } from "../interfaces/index.ts";

interface BoolTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: JsonotronTypeDef;
}

export function generateBoolTypeValidation(props: BoolTypeValidationProps) {
  const typeCheck = `
    if (typeof ${props.valuePath} !== "boolean") {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        value: ${props.valuePath},
        msg: "Value must be a boolean.",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  return typeCheck;
}
