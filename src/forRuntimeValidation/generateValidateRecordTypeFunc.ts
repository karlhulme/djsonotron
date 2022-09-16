import { TypescriptTreeFunction, TypescriptTreeInterface } from "../../deps.ts";
import {
  capitalizeFirstLetter,
  getJsonotronTypeFormalName,
  resolveJsonotronType,
} from "../utils/index.ts";
import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { generateRecordTypeValidation } from "../validationClauses/index.ts";
import { generateValidateFunctionShell } from "./generateValidateFunctionShell.ts";

/**
 * Returns a typescript record interface for a record type.
 * @param def A record type definition.
 * @param types An array of Jsonotron types.
 */
export function generateRecordTypeInterface<TypeNames extends string>(
  def: RecordTypeDef<TypeNames>,
  types: JsonotronTypeDef[],
): TypescriptTreeInterface {
  return {
    name: getJsonotronTypeFormalName(def),
    comment: def.summary,
    exported: true,
    members: def.properties.map((property) => {
      const propertyType = resolveJsonotronType(property.propertyType, types);
      const propertyTsTypeName = getTypescriptTypeForJsonotronTypeDef(
        propertyType,
      );

      return {
        name: property.name,
        optional: !property.isRequired,
        deprecated: Boolean(property.deprecated),
        typeName: propertyTsTypeName + (property.isArray ? "[]" : ""),
        comment: property.summary,
        nullable: Boolean(property.isNullable),
      };
    }),
  };
}

/**
 * Return a typescript function definition for a record type.
 * @param def A record type definition.
 * @param types An array of Jsonotron types.
 */
export function generateValidateRecordTypeFunc<TypeNames extends string>(
  def: RecordTypeDef<TypeNames>,
  types: JsonotronTypeDef[],
): TypescriptTreeFunction {
  return {
    ...generateValidateFunctionShell(def),
    lines: `
      const errors: ValidationError[] = [];
      ${
      generateRecordTypeValidation({
        def,
        valueDisplayPath: "${valueDisplayPath}",
        valuePath: "value",
        types,
      })
    }
      return errors;
    `,
  };
}

/**
 * Returns the equivalent typescript type name for the given type name.
 * @param def A Jsonotron type.
 */
function getTypescriptTypeForJsonotronTypeDef(def: JsonotronTypeDef) {
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
