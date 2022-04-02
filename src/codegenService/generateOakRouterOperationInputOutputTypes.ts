import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOakRouterOperationInputType } from "./generateOakRouterOperationInputType.ts";
import { generateOakRouterOperationOutputType } from "./generateOakRouterOperationOutputType.ts";

export function generateOakRouterOperationInputOutputTypes(
  service: Service, 
  types: JsonotronTypeDef[]
) {
  const declarations: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      declarations.push(...generateOakRouterOperationInputType(path, path.delete, types));
      declarations.push(...generateOakRouterOperationOutputType(path.delete));
    }

    if (path.get) {
      declarations.push(...generateOakRouterOperationInputType(path, path.get, types));
      declarations.push(...generateOakRouterOperationOutputType(path.get));
    }

    if (path.patch) {
      declarations.push(...generateOakRouterOperationInputType(path, path.patch, types));
      declarations.push(...generateOakRouterOperationOutputType(path.patch));
    }

    if (path.post) {
      declarations.push(...generateOakRouterOperationInputType(path, path.post, types));
      declarations.push(...generateOakRouterOperationOutputType(path.post));
    }

    if (path.put) {
      declarations.push(...generateOakRouterOperationInputType(path, path.put, types));
      declarations.push(...generateOakRouterOperationOutputType(path.put));
    }
  }

  return declarations;
}
