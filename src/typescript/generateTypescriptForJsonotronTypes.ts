import { EnumTypeDef, JsonotronTypeDef } from "../interfaces/index.ts";
import { generateTypescriptForEnum } from "./generateTypescriptForEnum.ts";

export function generateTypescriptForJsonotronTypes(types: JsonotronTypeDef[]) {
  const declarations = [];

  for (const type of types) {
    if (type.kind === "enum") {
      declarations.push(generateTypescriptForEnum(type as EnumTypeDef));
    } else if (type.kind === "record") {
      // generate typescript for reord
    }
  }

  return declarations.join("\n\n");
}
