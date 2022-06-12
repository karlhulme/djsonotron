import { Service, ServicePathOperation } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateOakRouterConstructorProps(service: Service) {
  const declarations: string[] = [];

  const interfaceLines: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      interfaceLines.push(
        generateOperationLine(path.delete),
      );
    }

    if (path.get) {
      interfaceLines.push(
        generateOperationLine(path.get),
      );
    }

    if (path.patch) {
      interfaceLines.push(
        generateOperationLine(path.patch),
      );
    }

    if (path.post) {
      interfaceLines.push(
        generateOperationLine(path.post),
      );
    }

    if (path.put) {
      interfaceLines.push(
        generateOperationLine(path.put),
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

function generateOperationLine(op: ServicePathOperation) {
  const needsProps = Boolean(op.requestBodyType) ||
    Boolean(op.requestQueryType) ||
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
