import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateImports } from "./generateImports.ts";
import { generateUtilityFunctions } from "./generateUtilityFunctions.ts";
import { generateOakRouter } from "./generateOakRouter.ts";
import { getTypesReferencedByServiceShallow } from "./getTypesReferencedByServiceShallow.ts";

interface GenerateCodeForServiceProps {
  service: Service;
  types: JsonotronTypeDef[];
  typesPath: string;
  depsPath: string;
}

export function generateCodeForService(props: GenerateCodeForServiceProps) {
  const referencedTypes = getTypesReferencedByServiceShallow(
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
