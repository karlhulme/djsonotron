import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOakRouterPath } from "./generateOakRouterPath.ts";
import { generateOakRouterOpenApiPath } from './generateOakRouterOpenApiPath.ts';

export function generateOakRouterConstructor(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  for (const path of service.paths) {
    lines.push(...generateOakRouterPath(path, types));
  }

  lines.push(...generateOakRouterOpenApiPath(service, types))

  return [`export function createRouter(props: CreateRouterProps) {
    const router = new Router();
    router
    ${lines.join("\n")}
    return router
  }`];
}
