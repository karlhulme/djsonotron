import {
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
  StringTypeDef,
  TypeDefValidationError,
} from "../interfaces/index.ts";
import { validateFloatTypeDef } from "./validateFloatTypeDef.ts";
import { validateIntTypeDef } from "./validateIntTypeDef.ts";
import { validateRecordTypeDef } from "./validateRecordTypeDef.ts";
import { validateStringTypeDef } from "./validateStringTypeDef.ts";

export function validateJsonotronTypes<TypeNames extends string>(
  types: JsonotronTypeDef[],
) {
  const errors: TypeDefValidationError[] = [];

  for (const type of types) {
    if (type.kind === "float") {
      validateFloatTypeDef(type as FloatTypeDef, errors);
    } else if (type.kind === "int") {
      validateIntTypeDef(type as IntTypeDef, errors);
    } else if (type.kind === "record") {
      validateRecordTypeDef(type as RecordTypeDef<TypeNames>, types, errors);
    } else if (type.kind === "string") {
      validateStringTypeDef(type as StringTypeDef, errors);
    }
  }

  return errors;
}
