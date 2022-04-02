import { JsonotronTypeDef, Service, ServicePath } from "../interfaces/index.ts";
import { generateOakRouterOperation } from "./generateOakRouterOperation.ts";

export function generateOakRouterConstructor(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  for (const path of service.paths) {
    lines.push(...generateOakRouterPath(path, types));
  }

  return [`export function createRouter(props: CreateRouterProps) {
    const router = new Router();
    router
    ${lines.join("\n")}
    return router
  }`];
}

export function generateOakRouterPath(
  path: ServicePath,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  if (path.delete) {
    lines.push(
      ...generateOakRouterOperation("delete", path, path.delete, types),
    );
  }

  if (path.get) {
    lines.push(
      ...generateOakRouterOperation("get", path, path.get, types),
    );
  }

  if (path.patch) {
    lines.push(
      ...generateOakRouterOperation("patch", path, path.patch, types),
    );
  }

  if (path.post) {
    lines.push(
      ...generateOakRouterOperation("post", path, path.post, types),
    );
  }

  if (path.put) {
    lines.push(
      ...generateOakRouterOperation("put", path, path.put, types),
    );
  }

  return lines;
}
