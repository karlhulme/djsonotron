import {
  JsonotronTypeDef,
  RecordTypeDef,
  RecordTypeDefProperty,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

export function generateTypescriptForRecord(
  def: RecordTypeDef,
  types: JsonotronTypeDef[],
) {
  const propertyStrings = def.properties
    .map((property) => {
      const propertySystem = getSystemFromTypeString(
        property.propertyType,
        def.system,
      );
      const propertyTypeName = getTypeFromTypeString(property.propertyType);
      const propertyValueTypeDef = types.find((t) =>
        t.system === propertySystem && t.name === propertyTypeName
      );

      if (propertyValueTypeDef) {
        return `  /**\n   * ${property.summary}\n   */\n  ${
          generateTypescriptForRecordProperty(property, propertyValueTypeDef)
        }`;
      } else {
        return "";
      }
    })
    .join("\n\n");

  return `
/**
 * ${def.summary}
 */
export interface ${def.system}${capitalizeFirstLetter(def.name)} {
${propertyStrings}
}
`;
}

function generateTypescriptForRecordProperty(
  property: RecordTypeDefProperty,
  propertyType: JsonotronTypeDef,
) {
  const requiredness = property.isRequired ? "" : "?";
  const nullness = property.isNullable ? "|null" : "";
  const typeName = getTypescriptTypeForJsonotronTypeDef(propertyType);

  return `${property.name}${requiredness}: ${typeName}${nullness}`;
}

function getTypescriptTypeForJsonotronTypeDef(def: JsonotronTypeDef) {
  switch (def.kind) {
    case "bool":
      return "boolean";
    case "enum":
      return `${def.system}${capitalizeFirstLetter(def.name)}`;
    case "float":
      return "number";
    case "int":
      return "number";
    case "object":
      return "unknown";
    case "record":
      return `${def.system}${capitalizeFirstLetter(def.name)}`;
    case "string":
      return "string";
    default:
      return "never";
  }
}
