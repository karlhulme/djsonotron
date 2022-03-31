import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateImports } from "./generateImports.ts";
import { generateUtilityFunctions } from "./generateUtilityFunctions.ts";
import { generateOakRouter } from "./generateOakRouter.ts";
import { getTypeNamesReferencedByService } from "./getTypeNamesReferencedByService.ts";

interface GenerateCodeForServiceProps {
  service: Service;
  types: JsonotronTypeDef[];
  typesPath: string;
  depsPath: string;
}

export function generateCodeForService(props: GenerateCodeForServiceProps) {
  const typeNames = getTypeNamesReferencedByService(props.service);

  const importLines = generateImports({
    depsPath: props.depsPath,
    typesPath: props.typesPath,
    typeNames,
  });

  return `
    ${importLines}
    ${generateUtilityFunctions()}
    ${generateOakRouter(props.service, props.types)}
  `;
}
