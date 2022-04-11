import { parseYaml } from "../../deps.ts";
import { OpenApiSpec } from "../interfaces/index.ts";
import { generateSchemaInterfaces } from "./generateSchemaInterfaces.ts";
import { generateSchemaEnums } from "./generateSchemaEnums.ts";
import { generateUrlBuilders } from "./generateUrlBuilders.ts";
import { generateOpMethods } from "./generateOpMethods.ts";

interface GenerateOpenApiClientProps {
  openApiDefinition: string;
}

export function generateOpenApiClient(props: GenerateOpenApiClientProps) {
  const openApi = parseYaml(props.openApiDefinition) as OpenApiSpec;

  return `
  ${generateSchemaInterfaces(openApi)}
  ${generateSchemaEnums(openApi)}
  ${generateUrlBuilders(openApi)}
  ${generateOpMethods(openApi)}
`;
}
