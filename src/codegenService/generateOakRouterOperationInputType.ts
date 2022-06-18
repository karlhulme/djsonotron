import {
  JsonotronTypeDef,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getJsonotronTypeUnderlyingTypescriptType,
  getServicePathParameters,
  getSystemFromTypeString,
  getTypeFromTypeString,
  resolveJsonotronType,
} from "../utils/index.ts";

export function generateOakRouterOperationInputType(
  path: ServicePath,
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
) {
  const declarations: string[] = [];

  const reqBodySystem = op.requestBodyType
    ? getSystemFromTypeString(op.requestBodyType)
    : null;

  const reqBodyType = op.requestBodyType
    ? getTypeFromTypeString(op.requestBodyType)
    : null;

  const pathParamDeclarations = getServicePathParameters(path.relativeUrl).map(
    (param) => {
      const type = resolveJsonotronType(param.type, types);

      if (!type) {
        throw new Error(
          `Unable to resolve type ${param.type} for parameter ${param.name} on path ${path.relativeUrl}.`,
        );
      }

      const underlyingType = type.kind === "float" || type.kind === "int"
        ? "number"
        : "string";

      return `${param.name}: ${underlyingType}`;
    },
  );

  const queryParamDeclarations: string[] = [];

  if (Array.isArray(op.requestQueryParams)) {
    for (const queryParam of op.requestQueryParams) {
      const queryParamType = resolveJsonotronType(queryParam.paramType, types);

      if (!queryParamType) {
        throw new Error(
          `Unable to resolve type ${queryParam.paramType} for query param ${queryParam.name} on path ${path.relativeUrl}.`,
        );
      }

      queryParamDeclarations.push(
        `${queryParam.name}${queryParam.isRequired ? "" : "?"}: ${
          getJsonotronTypeUnderlyingTypescriptType(queryParamType)
        }`,
      );
    }
  }

  const reqBodyPropertyDeclaration = reqBodySystem && reqBodyType
    ? `body: ${capitalizeFirstLetter(reqBodySystem)}${
      capitalizeFirstLetter(reqBodyType)
    }${op.requestBodyTypeArray ? "[]" : ""}`
    : "";

  const headerPropertyDeclarations: string[] = [];

  if (Array.isArray(op.requestHeaders)) {
    for (const header of op.requestHeaders) {
      const headerType = resolveJsonotronType(header.headerType, types);

      if (!headerType) {
        throw new Error(
          `Unable to resolve type ${header.headerType} for header ${header.name} on path ${path.relativeUrl}.`,
        );
      }

      headerPropertyDeclarations.push(
        `${header.name}${header.isRequired ? "" : "?"}: ${
          getJsonotronTypeUnderlyingTypescriptType(headerType)
        }`,
      );
    }
  }

  const cookieDeclarations: string[] = [];

  if (Array.isArray(op.requestCookies)) {
    for (const cookie of op.requestCookies) {
      const cookieType = resolveJsonotronType(cookie.cookieType, types);

      if (!cookieType) {
        throw new Error(
          `Unable to resolve type ${cookie.cookieType} for cookie ${cookie.name} on path ${path.relativeUrl}.`,
        );
      }

      cookieDeclarations.push(
        `${cookie.name}${cookie.isRequired ? "" : "?"}: ${
          getJsonotronTypeUnderlyingTypescriptType(cookieType)
        }`,
      );
    }
  }

  const propsInterface = `
  export interface ${capitalizeFirstLetter(op.operationName)}Props {
    ${pathParamDeclarations.join("\n    ")}
    ${queryParamDeclarations.join("\n    ")}
    ${reqBodyPropertyDeclaration}
    ${headerPropertyDeclarations.join("\n    ")}
    ${cookieDeclarations.join("\n    ")}
  } 
  `;

  declarations.push(propsInterface);

  return declarations;
}
