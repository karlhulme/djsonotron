import {
  EnumTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
} from "../interfaces/index.ts";
import { generateTypescriptForEnum } from "./generateTypescriptForEnum.ts";
import { generateTypescriptForRecord } from "./generateTypescriptForRecord.ts";
import { generateTypescriptSharedTypes } from "./generateTypescriptSharedTypes.ts";

export function generateTypescriptForJsonotronTypes(types: JsonotronTypeDef[]) {
  const declarations = [];

  declarations.push(generateTypescriptSharedTypes());

  for (const type of types) {
    if (type.kind === "enum") {
      declarations.push(generateTypescriptForEnum(type as EnumTypeDef));
    } else if (type.kind === "record") {
      declarations.push(
        generateTypescriptForRecord(type as RecordTypeDef, types),
      );
    }
  }

  return declarations.join("\n\n");
}
