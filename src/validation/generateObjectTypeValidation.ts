import { JsonotronTypeDef } from "../interfaces/index.ts";

interface ObjectTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: JsonotronTypeDef;
}

export function generateObjectTypeValidation(props: ObjectTypeValidationProps) {
  const typeCheck = `
    if (typeof ${props.valuePath} !== "object" || ${props.valuePath} === "null" || Array.isArray(${props.valuePath}) {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        msg: "Should be an object (non null and not an array).",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  return typeCheck;
}
