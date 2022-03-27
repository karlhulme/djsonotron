import {
  EnumTypeDef,
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { generateTypescriptForBool } from "./generateTypescriptForBool.ts";
import { generateTypescriptForEnum } from "./generateTypescriptForEnum.ts";
import { generateTypescriptForFloat } from "./generateTypescriptForFloat.ts";
import { generateTypescriptForInt } from "./generateTypescriptForInt.ts";
import { generateTypescriptForObject } from "./generateTypescriptForObject.ts";
import { generateTypescriptForRecord } from "./generateTypescriptForRecord.ts";
import { generateTypescriptForString } from "./generateTypescriptForString.ts";
import { generateTypescriptSharedTypes } from "./generateTypescriptSharedTypes.ts";

export function generateTypescriptForJsonotronTypes(types: JsonotronTypeDef[]) {
  const declarations = [];

  declarations.push(generateTypescriptSharedTypes());

  for (const type of types) {
    if (type.kind === "bool") {
      declarations.push(generateTypescriptForBool(type));
    } else if (type.kind === "enum") {
      declarations.push(generateTypescriptForEnum(type as EnumTypeDef));
    } else if (type.kind === "float") {
      declarations.push(generateTypescriptForFloat(type as FloatTypeDef));
    } else if (type.kind === "int") {
      declarations.push(generateTypescriptForInt(type as IntTypeDef));
    } else if (type.kind === "object") {
      declarations.push(generateTypescriptForObject(type));
    } else if (type.kind === "record") {
      declarations.push(
        generateTypescriptForRecord(type as RecordTypeDef, types),
      );
    } else if (type.kind === "string") {
      declarations.push(generateTypescriptForString(type as StringTypeDef));
    }
  }

  return declarations.join("\n\n");
}
