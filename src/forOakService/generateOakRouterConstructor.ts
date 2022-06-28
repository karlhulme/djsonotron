import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOakRouterPath } from "./generateOakRouterPath.ts";
import { generateOakRouterPathForOpenApi } from "./generateOakRouterPathForOpenApi.ts";
import { generateOakRouterPathForRoot } from "./generateOakRouterPathForRoot.ts";

export function generateOakRouterConstructor(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  for (const path of service.paths) {
    lines.push(...generateOakRouterPath(path, types));
  }

  lines.push(...generateOakRouterPathForRoot());
  lines.push(...generateOakRouterPathForOpenApi(service, types));

  return [`export function createRouter(props: CreateRouterProps) {
    const router = new Router();
    router
    ${lines.join("\n")}
    return router
  }`];
}
