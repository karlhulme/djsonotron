import { JsonotronTypeDef } from "../interfaces/index.ts";
import {
  getJsonotronTypeFormalName,
  getJsonotronTypeValidationFuncName,
} from "../utils/index.ts";

interface GenerateImportsProps {
  typesPath: string;
  referencedTypes: JsonotronTypeDef[];
  depsPath: string;
}

export function generateImports(props: GenerateImportsProps) {
  const typeImports: string[] = [];

  for (const type of props.referencedTypes) {
    if (type.kind === "record") {
      typeImports.push(getJsonotronTypeFormalName(type));
    }

    typeImports.push(getJsonotronTypeValidationFuncName(type));
  }

  return `
    // deno-lint-ignore-file no-unused-vars
    import { ${typeImports.join(", ")} } from "${props.typesPath}";
    import { Context, isHttpError, Request, Router, Status } from "${props.depsPath}";
  `;
}
