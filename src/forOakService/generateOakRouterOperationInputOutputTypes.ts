import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOakRouterOperationInputType } from "./generateOakRouterOperationInputType.ts";
import { generateOakRouterOperationOutputType } from "./generateOakRouterOperationOutputType.ts";

export function generateOakRouterOperationInputOutputTypes(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const declarations: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      declarations.push(
        ...generateOakRouterOperationInputType(path, path.delete, types),
      );
      declarations.push(
        ...generateOakRouterOperationOutputType(path, path.delete, types),
      );
    }

    if (path.get) {
      declarations.push(
        ...generateOakRouterOperationInputType(path, path.get, types),
      );
      declarations.push(
        ...generateOakRouterOperationOutputType(path, path.get, types),
      );
    }

    if (path.patch) {
      declarations.push(
        ...generateOakRouterOperationInputType(path, path.patch, types),
      );
      declarations.push(
        ...generateOakRouterOperationOutputType(path, path.patch, types),
      );
    }

    if (path.post) {
      declarations.push(
        ...generateOakRouterOperationInputType(path, path.post, types),
      );
      declarations.push(
        ...generateOakRouterOperationOutputType(path, path.post, types),
      );
    }

    if (path.put) {
      declarations.push(
        ...generateOakRouterOperationInputType(path, path.put, types),
      );
      declarations.push(
        ...generateOakRouterOperationOutputType(path, path.put, types),
      );
    }
  }

  return declarations;
}
