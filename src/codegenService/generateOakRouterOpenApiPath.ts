import { stringifyYaml } from "../../deps.ts";
import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOpenApiService } from "../codegenOpenApi/index.ts";

export function generateOakRouterOpenApiPath(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const openApiService = generateOpenApiService({
    service,
    types,
  }) as unknown as Record<string, unknown>;
  console.log(openApiService);
  const lines: string[] = [];

  lines.push(`  .get("/openapi", async (ctx) => {
    ctx.response.body = \`${
    stringifyYaml(openApiService, {
      skipInvalid: true,
    })
  }\`
  }`);

  return lines;
}
