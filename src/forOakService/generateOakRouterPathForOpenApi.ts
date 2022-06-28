import { stringifyYaml } from "../../deps.ts";
import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOpenApiService } from "../forOpenApi/index.ts";

export function generateOakRouterPathForOpenApi(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const openApiService = generateOpenApiService({
    service,
    types,
  }) as unknown as Record<string, unknown>;

  const openApiServiceYaml = stringifyYaml(openApiService, {
    skipInvalid: true,
  });

  const lines: string[] = [];

  lines.push(`  .get("/openapi", (ctx) => {
    ctx.response.body = \`${openApiServiceYaml}\`
  })`);

  return lines;
}
