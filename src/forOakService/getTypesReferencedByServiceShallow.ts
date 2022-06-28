import {
  JsonotronTypeDef,
  Service,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  getServicePathParameters,
  resolveJsonotronType,
} from "../utils/index.ts";

export function getTypesReferencedByServiceShallow(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const typeNames: string[] = [];

  for (const path of service.paths) {
    for (const param of getServicePathParameters(path.relativeUrl)) {
      typeNames.push(param.type);
    }

    if (path.delete) {
      appendTypesReferencedByServicePathOperation(path.delete, typeNames);
    }

    if (path.get) {
      appendTypesReferencedByServicePathOperation(path.get, typeNames);
    }

    if (path.patch) {
      appendTypesReferencedByServicePathOperation(path.patch, typeNames);
    }

    if (path.post) {
      appendTypesReferencedByServicePathOperation(path.post, typeNames);
    }

    if (path.put) {
      appendTypesReferencedByServicePathOperation(path.put, typeNames);
    }
  }

  const referencedTypes: JsonotronTypeDef[] = [];

  for (const typeName of typeNames) {
    const resolvedType = resolveJsonotronType(typeName, types);

    if (resolvedType && !referencedTypes.includes(resolvedType)) {
      referencedTypes.push(resolvedType);
    }
  }

  return referencedTypes;
}

function appendTypesReferencedByServicePathOperation(
  op: ServicePathOperation,
  typeNames: string[],
) {
  if (op.requestBodyType) {
    typeNames.push(op.requestBodyType);
  }

  if (Array.isArray(op.requestQueryParams)) {
    for (const queryParam of op.requestQueryParams) {
      typeNames.push(queryParam.paramType);
    }
  }

  if (Array.isArray(op.requestParams)) {
    for (const bodyParam of op.requestParams) {
      typeNames.push(bodyParam.paramType);
    }
  }

  if (Array.isArray(op.requestHeaders)) {
    for (const header of op.requestHeaders) {
      typeNames.push(header.headerType);
    }
  }

  if (Array.isArray(op.requestCookies)) {
    for (const cookie of op.requestCookies) {
      typeNames.push(cookie.cookieType);
    }
  }

  if (op.responseBodyType) {
    typeNames.push(op.responseBodyType);
  }

  if (Array.isArray(op.responseHeaders)) {
    for (const header of op.responseHeaders) {
      typeNames.push(header.headerType);
    }
  }
}
