import {
  JsonotronTypeDef,
  Service
} from "../interfaces/index.ts";
import {
  generateOpenApiService
} from '../codegenOpenApi/index.ts';

export function generateOakRouterOpenApiPath (service: Service, types: JsonotronTypeDef[]) {
  const openApiService = generateOpenApiService({ service, types });

  const lines: string[] = [];

  lines.push(`  .get("/openapi", async (ctx) => {
    ctx.response.body = ${openApiService}
  }`)

  return lines;
}
