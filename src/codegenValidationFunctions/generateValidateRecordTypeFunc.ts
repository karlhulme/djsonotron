import {
  JsonotronTypeDef,
  RecordTypeDef,
  RecordTypeDefProperty,
} from "../interfaces/index.ts";
import { generateRecordTypeValidation } from "../codegenValidationClauses/index.ts";
import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

export function generateValidateRecordTypeFunc(
  def: RecordTypeDef,
  types: JsonotronTypeDef[],
) {
  const propertyStrings: string[] = [];

  for (const property of def.properties) {
    const propertySystem = getSystemFromTypeString(
      property.propertyType,
      def.system,
    );
    const propertyTypeName = getTypeFromTypeString(property.propertyType);
    const propertyValueTypeDef = types.find((t) =>
      t.system === propertySystem && t.name === propertyTypeName
    );

    if (propertyValueTypeDef) {
      propertyStrings.push(
        `  /**\n   * ${property.summary}\n   * (${propertyValueTypeDef.system}/${propertyValueTypeDef.name})\n   */\n  ${
          generateRecordPropertyDeclaration(property, propertyValueTypeDef)
        }`,
      );
    }
  }

  return `
/**
 * ${def.summary}
 */
export interface ${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } {
${propertyStrings.join("\n\n")}
}

/**
 * Validate the given object to ensure it is a valid ${def.system}/${def.name} record.
 */
export function validate${capitalizeFirstLetter(def.system)}${
    capitalizeFirstLetter(def.name)
  } (value: any, valueDisplayPath: string): ValidationError[] {
  const errors: ValidationError[] = [];
  ${
    generateRecordTypeValidation({
      def,
      types,
      valueDisplayPath: "${valueDisplayPath}",
      valuePath: "value",
    })
  }
  return errors;
}
`;
}

function generateRecordPropertyDeclaration(
  property: RecordTypeDefProperty,
  propertyType: JsonotronTypeDef,
) {
  const requiredness = property.isRequired ? "" : "?";
  const arrayness = property.isArray ? "[]" : "";
  const nullness = property.isNullable ? "|null" : "";
  const typeName = getTypeForJsonotronTypeDef(propertyType);

  return `${property.name}${requiredness}: ${typeName}${arrayness}${nullness}`;
}

function getTypeForJsonotronTypeDef(def: JsonotronTypeDef) {
  switch (def.kind) {
    case "bool":
      return "boolean";
    case "enum":
      return `${capitalizeFirstLetter(def.system)}${
        capitalizeFirstLetter(def.name)
      }`;
    case "float":
      return "number";
    case "int":
      return "number";
    case "object":
      return "unknown";
    case "record":
      return `${capitalizeFirstLetter(def.system)}${
        capitalizeFirstLetter(def.name)
      }`;
    case "string":
      return "string";
    default:
      return "never";
  }
}
