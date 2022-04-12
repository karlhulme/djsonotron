import { parseYaml } from "../../deps.ts";
import { OpenApiSpec } from "../interfaces/index.ts";
import { generateSchemaInterfaces } from "./generateSchemaInterfaces.ts";
import { generateSchemaEnums } from "./generateSchemaEnums.ts";
import { generateUrlBuilders } from "./generateUrlBuilders.ts";
import { generateOpMethods } from "./generateOpMethods.ts";
import { generateRequestBodyTypes } from "./generateRequestBodyTypes.ts";
import { generateOperations } from "./generateOperations.ts";

interface GenerateOpenApiClientProps {
  openApiDefinition: string;
}

export function generateOpenApiClient(props: GenerateOpenApiClientProps) {
  const openApi = parseYaml(props.openApiDefinition) as OpenApiSpec;

  return `
  ${generateSchemaInterfaces(openApi)}
  ${generateSchemaEnums(openApi)}
  ${generateRequestBodyTypes(openApi)}
  ${generateUrlBuilders(openApi)}
  ${generateOpMethods(openApi)}
  ${generateOperations(openApi)}
`;
}
