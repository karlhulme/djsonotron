import { ServicePathOperation } from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

export function generateOakRouterOperationOutputType(op: ServicePathOperation) {
  const declarations: string[] = [];

  const resBodySystem = op.responseBodyType
    ? getSystemFromTypeString(op.responseBodyType)
    : null;

  const resBodyType = op.responseBodyType
    ? getTypeFromTypeString(op.responseBodyType)
    : null;

  const resultInterface = `
  export interface ${capitalizeFirstLetter(op.operationName)}Result {
    ${
    resBodySystem && resBodyType
      ? `body: ${capitalizeFirstLetter(resBodySystem)}${
        capitalizeFirstLetter(resBodyType)
      }`
      : ""
  }
    headers: HeaderNameValue[]
  }
  `;

  declarations.push(resultInterface);

  return declarations;
}
