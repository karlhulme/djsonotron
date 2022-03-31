import { Service } from "../interfaces/index.ts";
import { generateOakRouterOperationInputType } from "./generateOakRouterOperationInputType.ts";
import { generateOakRouterOperationOutputType } from "./generateOakRouterOperationOutputType.ts";

export function generateOakRouterOperationInputOutputTypes(service: Service) {
  const declarations: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      declarations.push(...generateOakRouterOperationInputType(path.delete));
      declarations.push(...generateOakRouterOperationOutputType(path.delete));
    }

    if (path.get) {
      declarations.push(...generateOakRouterOperationInputType(path.get));
      declarations.push(...generateOakRouterOperationOutputType(path.get));
    }

    if (path.patch) {
      declarations.push(...generateOakRouterOperationInputType(path.patch));
      declarations.push(...generateOakRouterOperationOutputType(path.patch));
    }

    if (path.post) {
      declarations.push(...generateOakRouterOperationInputType(path.post));
      declarations.push(...generateOakRouterOperationOutputType(path.post));
    }

    if (path.put) {
      declarations.push(...generateOakRouterOperationInputType(path.put));
      declarations.push(...generateOakRouterOperationOutputType(path.put));
    }
  }

  return declarations;
}
