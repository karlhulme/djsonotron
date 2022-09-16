import { generateTypescript, newTypescriptTree } from "../../deps.ts";
import { capitalizeFirstLetter } from "../index.ts";
import {
  EnumTypeDef,
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { generateValidateArrayFunc } from "./generateValidateArrayFunc.ts";
import { generateValidateArrayTypeFunc } from "./generateValidateArrayTypeFunc.ts";
import { generateValidateBoolTypeFunc } from "./generateValidateBoolTypeFunc.ts";
import {
  generateEnumTypeEnumConstArray,
  generateValidateEnumTypeFunc,
} from "./generateValidateEnumTypeFunc.ts";
import { generateValidateFloatTypeFunc } from "./generateValidateFloatTypeFunc.ts";
import { generateValidateIntTypeFunc } from "./generateValidateIntTypeFunc.ts";
import { generateValidateObjectTypeFunc } from "./generateValidateObjectTypeFunc.ts";
import {
  generateRecordTypeInterface,
  generateValidateRecordTypeFunc,
} from "./generateValidateRecordTypeFunc.ts";
import { generateValidateStringTypeFunc } from "./generateValidateStringTypeFunc.ts";
import { generateValidationErrorInterface } from "./generateValidationErrorInterface.ts";
import { generateValidatorWithStringOutputWrapper } from "./generateValidatorWithStringOutputWrapper.ts";

/**
 * Returns a typescript tree.
 * @param types An array of Jsonotron type definitions.
 */
export function generateCodeForJsonotronTypes<TypeNames extends string>(
  types: JsonotronTypeDef[],
) {
  const tree = newTypescriptTree();
  tree.lintDirectives.ignoreNoExplicitAny = true;

  tree.interfaces.push(generateValidationErrorInterface());

  tree.functions.push(generateValidatorWithStringOutputWrapper());
  tree.functions.push(generateValidateArrayFunc());

  for (const type of types) {
    if (type.kind === "bool") {
      tree.functions.push(generateValidateBoolTypeFunc(type));
    } else if (type.kind === "enum") {
      tree.enumConstArrays.push(
        generateEnumTypeEnumConstArray(type as EnumTypeDef),
      );
      tree.functions.push(generateValidateEnumTypeFunc(type as EnumTypeDef));
    } else if (type.kind === "float") {
      tree.functions.push(generateValidateFloatTypeFunc(type as FloatTypeDef));
    } else if (type.kind === "int") {
      tree.functions.push(generateValidateIntTypeFunc(type as IntTypeDef));
    } else if (type.kind === "object") {
      tree.functions.push(
        generateValidateObjectTypeFunc(type as JsonotronTypeDef),
      );
    } else if (type.kind === "record") {
      tree.interfaces.push(
        generateRecordTypeInterface(type as RecordTypeDef<TypeNames>, types),
      );
      tree.functions.push(
        generateValidateRecordTypeFunc(type as RecordTypeDef<TypeNames>, types),
      );
    } else if (type.kind === "string") {
      tree.functions.push(
        generateValidateStringTypeFunc(type as StringTypeDef),
      );
    }

    tree.functions.push(generateValidateArrayTypeFunc(type));
  }

  const systemNames = types.map((t) => t.system);
  const uniqueSystemNames = [...new Set(systemNames)];

  for (const uniqueSystemName of uniqueSystemNames) {
    tree.stringUnions.push({
      name: capitalizeFirstLetter(uniqueSystemName) + "TypeNames",
      comment:
        `The names of all the types defined in the ${uniqueSystemName} system.`,
      exported: true,
      values: types
        .filter((t) => t.system === uniqueSystemName)
        .map((t) => t.name),
    });
  }

  return generateTypescript(tree);
}
