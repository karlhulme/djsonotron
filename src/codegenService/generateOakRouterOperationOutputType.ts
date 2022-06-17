import {
  JsonotronTypeDef,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getJsonotronTypeUnderlyingTypescriptType,
  getSystemFromTypeString,
  getTypeFromTypeString,
  resolveJsonotronType,
} from "../utils/index.ts";

export function generateOakRouterOperationOutputType(
  path: ServicePath,
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
) {
  const declarations: string[] = [];

  const resBodySystem = op.responseBodyType
    ? getSystemFromTypeString(op.responseBodyType)
    : null;

  const resBodyType = op.responseBodyType
    ? getTypeFromTypeString(op.responseBodyType)
    : null;

  const headerPropertyDeclarations: string[] = [];

  if (Array.isArray(op.responseHeaders)) {
    for (const header of op.responseHeaders) {
      const headerType = resolveJsonotronType(header.headerType, types);

      if (!headerType) {
        throw new Error(
          `Unable to resolve type ${header.headerType} for response header ${header.name} on path ${path.relativeUrl}.`,
        );
      }

      headerPropertyDeclarations.push(
        `${header.name}${header.isGuaranteed ? "" : "?"}: ${
          getJsonotronTypeUnderlyingTypescriptType(headerType)
        }`,
      );
    }
  }

  if (
    op.responseBodyType ||
    (Array.isArray(op.responseHeaders) && op.responseHeaders.length > 0)
  ) {
    const resultInterface = `
    export interface ${capitalizeFirstLetter(op.operationName)}Result {
      ${
      resBodySystem && resBodyType
        ? `body: ${capitalizeFirstLetter(resBodySystem)}${
          capitalizeFirstLetter(resBodyType)
        }${op.requestBodyTypeArray ? "[]" : ""}`
        : ""
    }
      ${headerPropertyDeclarations.join("\n    ")}
    }
    `;

    declarations.push(resultInterface);
  }

  return declarations;
}
