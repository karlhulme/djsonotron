import {
  EnumTypeDef,
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { generateValidateArrayFunc } from './generateValidateArrayFunc.ts';
import { generateValidateArrayTypeFunc } from "./generateValidateArrayTypeFunc.ts";
import { generateValidateBoolTypeFunc } from "./generateValidateBoolTypeFunc.ts";
import { generateValidateEnumTypeFunc } from "./generateValidateEnumTypeFunc.ts";
import { generateValidateFloatTypeFunc } from "./generateValidateFloatTypeFunc.ts";
import { generateValidateIntTypeFunc } from "./generateValidateIntTypeFunc.ts";
import { generateValidateObjectTypeFunc } from "./generateValidateObjectTypeFunc.ts";
import { generateValidateRecordTypeFunc } from "./generateValidateRecordTypeFunc.ts";
import { generateValidateStringTypeFunc } from "./generateValidateStringTypeFunc.ts";
import { generateValidationErrorInterface } from "./generateValidationErrorInterface.ts";

export function generateCodeForJsonotronTypes(types: JsonotronTypeDef[]) {
  const declarations = [];

  declarations.push(generateValidationErrorInterface());
  declarations.push(generateValidateArrayFunc());

  for (const type of types) {
    if (type.kind === "bool") {
      declarations.push(generateValidateBoolTypeFunc(type));
    } else if (type.kind === "enum") {
      declarations.push(generateValidateEnumTypeFunc(type as EnumTypeDef));
    } else if (type.kind === "float") {
      declarations.push(generateValidateFloatTypeFunc(type as FloatTypeDef));
    } else if (type.kind === "int") {
      declarations.push(generateValidateIntTypeFunc(type as IntTypeDef));
    } else if (type.kind === "object") {
      declarations.push(generateValidateObjectTypeFunc(type));
    } else if (type.kind === "record") {
      declarations.push(
        generateValidateRecordTypeFunc(type as RecordTypeDef, types),
      );
    } else if (type.kind === "string") {
      declarations.push(generateValidateStringTypeFunc(type as StringTypeDef));
    }

    declarations.push(generateValidateArrayTypeFunc(type));
  }

  return declarations.join("\n\n");
}
