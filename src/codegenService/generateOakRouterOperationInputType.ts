import {
  JsonotronTypeDef,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
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

  const reqQuerySystem = op.requestQueryType
    ? getSystemFromTypeString(op.requestQueryType)
    : null;

  const reqQueryType = op.requestQueryType
    ? getTypeFromTypeString(op.requestQueryType)
    : null;

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

  const queryPropertyDeclaration = reqQuerySystem && reqQueryType
    ? `query: ${capitalizeFirstLetter(reqQuerySystem)}${
      capitalizeFirstLetter(reqQueryType)
    }`
    : "";

  const bodyPropertyDeclaration = reqBodySystem && reqBodyType
    ? `body: ${capitalizeFirstLetter(reqBodySystem)}${
      capitalizeFirstLetter(reqBodyType)
    }`
    : "";

  const propsInterface = `
  export interface ${capitalizeFirstLetter(op.operationName)}Props {
    ${pathParamDeclarations.join("\n    ")}
    ${queryPropertyDeclaration}
    ${bodyPropertyDeclaration}
    getHeader: (name: string) => string|null
    getCookie: (name: string) => Promise<string|undefined>
  } 
  `;

  declarations.push(propsInterface);

  return declarations;
}
