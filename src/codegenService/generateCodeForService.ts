import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateImports } from "./generateImports.ts";
import { generateUtilityFunctions } from "./generateUtilityFunctions.ts";
import { generateOakRouter } from "./generateOakRouter.ts";
import { getTypeReferencedByService } from "./getTypeReferencedByService.ts";

interface GenerateCodeForServiceProps {
  service: Service;
  types: JsonotronTypeDef[];
  typesPath: string;
  depsPath: string;
}

export function generateCodeForService(props: GenerateCodeForServiceProps) {
  const referencedTypes = getTypeReferencedByService(
    props.service,
    props.types,
  );

  const importLines = generateImports({
    depsPath: props.depsPath,
    typesPath: props.typesPath,
    referencedTypes,
  });

  return `
    ${importLines}
    ${generateUtilityFunctions()}
    ${generateOakRouter(props.service, props.types)}
  `;
}
