import { JsonotronTypeDef } from "../interfaces/index.ts";

interface VariantTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: JsonotronTypeDef;
}

export function generateVariantTypeValidation(
  props: VariantTypeValidationProps,
) {
  const typeCheck = `
    if (${props.valuePath} === null || Array.isArray(${props.valuePath})) {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        value: ${props.valuePath},
        msg: "Value cannot be null or an array.",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  return typeCheck;
}
