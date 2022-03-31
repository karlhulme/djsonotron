import { Service } from "../interfaces/index.ts";
import { generateImports } from "./generateImports.ts";
import { generateUtilityFunctions } from "./generateUtilityFunctions.ts";
import { generateOakRouter } from "./generateOakRouter.ts";
import { getTypeNamesReferencedByService } from "./getTypeNamesReferencedByService.ts";

interface GenerateCodeForServiceProps {
  service: Service;
  typesPath: string;
  depsPath: string;
}

export function generateCodeForService(props: GenerateCodeForServiceProps) {
  const typeNames = getTypeNamesReferencedByService(props.service);

  return `${
    generateImports({
      depsPath: props.depsPath,
      typesPath: props.typesPath,
      typeNames,
    })
  }
${generateUtilityFunctions()}
${generateOakRouter(props.service)}
`;
}
