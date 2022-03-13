import { EnumTypeDef, JsonotronTypeDef } from "../interfaces/index.ts";
import { generateTypescriptForEnum } from "./generateTypescriptForEnum.ts";

export function generateTypescriptForJsonotronTypes(types: JsonotronTypeDef[]) {
  return types
    .map((type) => {
      switch (type.kind) {
        case "enum":
          return generateTypescriptForEnum(type as EnumTypeDef);
        default:
          return "";
      }
    })
    .join("\n");
}
