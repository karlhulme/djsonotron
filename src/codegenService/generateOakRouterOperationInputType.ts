import { ServicePathOperation } from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

export function generateOakRouterOperationInputType(op: ServicePathOperation) {
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

  const propsInterface = `
  export interface ${capitalizeFirstLetter(op.operationName)}Props {
    ${
    reqQuerySystem && reqQueryType
      ? `query: ${capitalizeFirstLetter(reqQuerySystem)}${
        capitalizeFirstLetter(reqQueryType)
      }`
      : ""
  }
    ${
    reqBodySystem && reqBodyType
      ? `body: ${capitalizeFirstLetter(reqBodySystem)}${
        capitalizeFirstLetter(reqBodyType)
      }`
      : ""
  }
    getHeader: (name: string) => string|null
    getCookie: (name: string) => Promise<string|undefined>
  } 
  `;

  declarations.push(propsInterface);

  return declarations;
}
