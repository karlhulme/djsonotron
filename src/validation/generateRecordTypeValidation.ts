import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { getSystemFromTypeString } from "./getSystemFromTypeString.ts";
import { getTypeFromTypeString } from "./getTypeFromTypeString.ts";
import { generateRecordTypePropertyValidation } from "./generateRecordTypePropertyValidation.ts";
import { getSafeValuePath } from "./getSafeValuePath.ts";

interface RecordTypeValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: RecordTypeDef;
  types: JsonotronTypeDef[];
}

export function generateRecordTypeValidation(props: RecordTypeValidationProps) {
  const typeCheck = `
    if (typeof ${props.valuePath} !== "object" || ${props.valuePath} === null || Array.isArray(${props.valuePath})) {
      errors.push({
        valuePath: \`${props.valueDisplayPath}\`,
        value: ${props.valuePath},
        msg: "Value must be an object (non null and not an array).",
        type: "${props.def.system}/${props.def.name}",
      })
    }
  `;

  const requiredPropsChecks: string[] = [];

  if (Array.isArray(props.def.required)) {
    for (const reqPropName of props.def.required) {
      const requiredPropCheck = `
        if (typeof ${props.valuePath}.${reqPropName} === "undefined" || ${props.valuePath}.${reqPropName} === null) {
          errors.push({
            valuePath: \`${props.valueDisplayPath}.${reqPropName}\`,
            value: ${props.valuePath}.${reqPropName},
            msg: "Value is a required property and cannot be undefined or null.",
            type: "${props.def.system}/${props.def.name}",
          })
        }    
      `;

      requiredPropsChecks.push(requiredPropCheck);
    }
  }

  const recognisedProperties = props.def.properties
    .map((p) => `"${p.name}"`)
    .join(", ");

  const additionalPropsCheck = `
    for (const key of Object.keys(${props.valuePath})) {
      if (![${recognisedProperties}].includes(key)) {
        errors.push({
          valuePath: \`${props.valueDisplayPath}\`,
          value: ${props.valuePath},
          msg: \`Value must not contain unrecognised property: \${key}.\`,
          type: "${props.def.system}/${props.def.name}",
        })
      }
    }
  `;

  const propertyChecks: string[] = [];

  for (const property of props.def.properties) {
    const constantCheck = typeof property.constant === "string"
      ? `
        if (${props.valuePath}.${property.name} !== "${property.constant}") {
          errors.push({
            valuePath: \`${props.valueDisplayPath}.${property.name}\`,
            value: ${props.valuePath}.${property.name},
            msg: "Value must be ${property.constant}.",
            type: "${props.def.system}/${props.def.name}",
          })
        }
      `
      : "";

    const propertySystem = getSystemFromTypeString(
      property.propertyType,
      props.def.system,
    );
    const propertyTypeName = getTypeFromTypeString(property.propertyType);
    const propertyValueTypeDef = props.types.find((t) =>
      t.system === propertySystem && t.name === propertyTypeName
    );

    if (!propertyValueTypeDef) {
      throw new Error(`Unable to resolve type ${property.propertyType}.`);
    }

    const propertyValueChecks: string[] = [];

    if (property.isArray) {
      const arrayCheck = `
        if (!Array.isArray(${props.valuePath}.${property.name})) {
          errors.push({
            valuePath: \`${props.valueDisplayPath}.${property.name}\`,
            value: ${props.valuePath}.${property.name},
            msg: "Value must be an array.",
            type: "${props.def.system}/${props.def.name}",
          })
        }
      `;

      propertyValueChecks.push(arrayCheck);

      const indexVar = "idx_" +
        getSafeValuePath(`${props.valuePath}.${property.name}`);

      const arrayElementsCheck = `
        for (let ${indexVar} = 0; ${indexVar} < ${props.valuePath}.${property.name}.length; ${indexVar}++) {
          ${
        generateRecordTypePropertyValidation({
          valuePath: `${props.valuePath}.${property.name}[${indexVar}]`,
          valueDisplayPath:
            `${props.valueDisplayPath}.${property.name}[\${${indexVar}}]`,
          def: propertyValueTypeDef,
          types: props.types,
        })
      }
        }
      `;

      propertyValueChecks.push(arrayElementsCheck);
    } else {
      const valueCheck = generateRecordTypePropertyValidation({
        valuePath: `${props.valuePath}.${property.name}`,
        valueDisplayPath: props.valueDisplayPath,
        def: propertyValueTypeDef,
        types: props.types,
      });

      propertyValueChecks.push(valueCheck);
    }

    const propertyCheck = `
      if (typeof ${props.valuePath}.${property.name} !== 'undefined') {
        ${constantCheck}
        ${propertyValueChecks.join("\n\n")}
      }
    `;

    propertyChecks.push(propertyCheck);
  }

  return `
    ${typeCheck} else {
      ${requiredPropsChecks.join("\n\n")}
      ${additionalPropsCheck}
      ${propertyChecks.join("\n\n")}
    }
  `;
}
