import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import {
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";
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

  const propertyChecks: string[] = [];

  for (const property of props.def.properties) {
    if (property.isRequired) {
      const requiredPropCheck = `
        if (typeof ${props.valuePath}.${property.name} === "undefined") {
          errors.push({
            valuePath: \`${props.valueDisplayPath}.${property.name}\`,
            value: ${props.valuePath}.${property.name},
            msg: "Value is a required property and cannot be undefined.",
            type: "${property.propertyType}${property.isArray ? "[]" : ""}",
          })
        }    
      `;

      propertyChecks.push(requiredPropCheck);
    }

    if (!property.isNullable) {
      const nullablePropCheck = `
          if (${props.valuePath}.${property.name} === null) {
            errors.push({
              valuePath: \`${props.valueDisplayPath}.${property.name}\`,
              value: ${props.valuePath}.${property.name},
              msg: "Value must not be null.",
              type: "${property.propertyType}${property.isArray ? "[]" : ""}",
            })
          }    
        `;

      propertyChecks.push(nullablePropCheck);
    }

    if (typeof property.constant === "string") {
      const constantCheck = `
          if (typeof ${props.valuePath}.${property.name} === "string" && ${props.valuePath}.${property.name} !== "${property.constant}") {
            errors.push({
              valuePath: \`${props.valueDisplayPath}.${property.name}\`,
              value: ${props.valuePath}.${property.name},
              msg: "Value must be constant string '${property.constant}'.",
              type: "${property.propertyType}",
            })
          }
        `;

      propertyChecks.push(constantCheck);
    }

    const propertySystem = getSystemFromTypeString(
      property.propertyType,
      props.def.system,
    );
    const propertyTypeName = getTypeFromTypeString(property.propertyType);
    const propertyValueTypeDef = props.types.find((t) =>
      t.system === propertySystem && t.name === propertyTypeName
    );

    const propertyValueChecks: string[] = [];

    if (!propertyValueTypeDef) {
      const typeFailCheck = `
        errors.push({
          valuePath: \`${props.valueDisplayPath}.${property.name}\`,
          value: ${props.valuePath}.${property.name},
          msg: "Value cannot conform to unknown type.",
          type: "${property.propertyType}${property.isArray ? "[]" : ""}",
        })
      `;

      propertyValueChecks.push(typeFailCheck);
    } else if (property.isArray) {
      const arrayCheck = `
        if (typeof ${props.valuePath}.${property.name} !== "object" || !Array.isArray(${props.valuePath}.${property.name})) {
          errors.push({
            valuePath: \`${props.valueDisplayPath}.${property.name}\`,
            value: ${props.valuePath}.${property.name},
            msg: "Value must be an array of objects.",
            type: "${props.def.system}/${props.def.name}[]",
          })
        }
      `;

      propertyValueChecks.push(arrayCheck);

      const indexVar = "idx_" +
        getSafeValuePath(`${props.valuePath}.${property.name}`);

      const arrayElementsCheck = `
        if (typeof ${props.valuePath}.${property.name} === "object" && Array.isArray(${props.valuePath}.${property.name})) {
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
        }
      `;

      propertyValueChecks.push(arrayElementsCheck);
    } else {
      const valueCheck = `
        if (${props.valuePath}.${property.name} !== null) {
          ${
        generateRecordTypePropertyValidation({
          valuePath: `${props.valuePath}.${property.name}`,
          valueDisplayPath: `${props.valueDisplayPath}.${property.name}`,
          def: propertyValueTypeDef,
          types: props.types,
        })
      }
        }`;

      propertyValueChecks.push(valueCheck);
    }

    const propertyCheck = `
      if (typeof ${props.valuePath}.${property.name} !== 'undefined') {
        ${propertyValueChecks.join("\n\n")}
      }
    `;

    propertyChecks.push(propertyCheck);
  }

  const recognisedProperties = props.def.properties
    .map((p) => `"${p.name}"`)
    .join(", ");

  const additionalPropsCheck = `
    for (const key of Object.keys(${props.valuePath})) {
      if (![${recognisedProperties}].includes(key)) {
        delete ${props.valuePath}[key]
      }
    }
  `;

  return `
    ${typeCheck} else {
      ${propertyChecks.join("\n\n")}
      ${additionalPropsCheck}
    }
  `;
}
