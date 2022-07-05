import {
  Service,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateOakRouterConstructorProps(service: Service) {
  const declarations: string[] = [];

  const interfaceLines: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      interfaceLines.push(
        generateOperationLine(path, path.delete),
      );
    }

    if (path.get) {
      interfaceLines.push(
        generateOperationLine(path, path.get),
      );
    }

    if (path.patch) {
      interfaceLines.push(
        generateOperationLine(path, path.patch),
      );
    }

    if (path.post) {
      interfaceLines.push(
        generateOperationLine(path, path.post),
      );
    }

    if (path.put) {
      interfaceLines.push(
        generateOperationLine(path, path.put),
      );
    }
  }

  const resultInterface = `
  export interface CreateRouterProps {
    ${interfaceLines.join("\n")}
  }
  `;

  declarations.push(resultInterface);

  return declarations;
}

function generateOperationLine(path: ServicePath, op: ServicePathOperation) {
  const needsProps = path.relativeUrl.includes("{") ||
    Boolean(op.requestBodyType) ||
    (Array.isArray(op.requestQueryParams) &&
      op.requestQueryParams.length > 0) ||
    (Array.isArray(op.requestParams) &&
      op.requestParams.length > 0) ||
    (Array.isArray(op.requestHeaders) && op.requestHeaders.length > 0) ||
    (Array.isArray(op.requestCookies) && op.requestCookies.length > 0);

  const props = needsProps
    ? `props: ${capitalizeFirstLetter(op.operationName)}Props`
    : "";

  const needsResult = op.responseBodyType ||
    (Array.isArray(op.responseHeaders) && op.responseHeaders.length > 0);

  const result = needsResult
    ? `${capitalizeFirstLetter(op.operationName)}Result`
    : "void";

  return `${op.operationName}: (${props}) => Promise<${result}>`;
}
