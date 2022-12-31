// deno-lint-ignore-file no-explicit-any
import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";
import { stringArrayToTypescriptUnion } from "./stringArrayToTypescriptUnion.ts";
import {
  headerSchemaUrl,
  outboundHeaderSchemaUrl,
  queryParamSchemaUrl,
} from "./schemaUrls.ts";

export function createOperationConst(
  resource: any,
  method: any,
  allResources: any[],
): TypescriptTreeConstDeclaration {
  let requestBodyTypeParam = "void";
  let requestBodyTypeLine = "";

  if (Array.isArray(method.requestBodyProperties)) {
    requestBodyTypeParam = `${capitalizeFirstLetter(resource.system)}${
      capitalizeFirstLetter(method.operationId)
    }RequestBody`;

    requestBodyTypeLine = `requestBodyType: ${resource.system}${
      capitalizeFirstLetter(method.operationId)
    }RequestBodyType,`;
  }

  let responseBodyTypeParam = "void";
  let responseBodyTypeLine = "";

  if (typeof method.responseBodyType === "string") {
    const rbtSys = getSystemFromTypeString(method.responseBodyType);
    const rbtType = getTypeFromTypeString(method.responseBodyType);
    responseBodyTypeParam = `${capitalizeFirstLetter(rbtSys)}${
      capitalizeFirstLetter(rbtType)
    }${method.responseBodyTypeArray ? "[]" : ""}`;

    responseBodyTypeLine = `responseBodyType: ${rbtSys}${
      capitalizeFirstLetter(rbtType)
    }${method.responseBodyTypeArray ? "Array" : ""}Type,`;
  }

  const responseSuccessCodeLine = method.responseSuccessCode
    ? `responseSuccessCode: ${method.responseSuccessCode},`
    : "";

  let responseFailureDefsLine = "";

  if (Array.isArray(method.responseFailureDefinitions)) {
    const rfcs = method.responseFailureDefinitions
      .map((rfc: any) => `
        {
          code: ${rfc.code},
          summary: "${rfc.summary}"
        }`)
      .join(", ");

    responseFailureDefsLine = `responseFailureDefinitions: [${rfcs}],`;
  }

  let summaryLine = "";

  if (method.summary) {
    summaryLine = `summary: "${method.summary}",`;
  }

  let deprecatedLine = "";

  if (method.deprecated) {
    deprecatedLine = `deprecated: true,`;
  }

  const urlParamNames = (resource.urlParams || [])
    .map((urlp: any) => urlp.name);

  const headerNames = method.headerNames || [];
  const queryParamNames = method.queryParamNames || [];
  const responseHeaderNames = method.responseHeaderNames || [];

  // build headers declaration
  const headers = "[" + headerNames.map((h: any) => {
    const headerResource = allResources.find((r) =>
      r["$schema"] === headerSchemaUrl && r.name === h
    );
    if (!headerResource) {
      throw new Error(`Cannot find header ${h} on ${method.operationId}.`);
    }
    const hSystem = getSystemFromTypeString(headerResource.type);
    const hType = getTypeFromTypeString(headerResource.type);
    const reqLine = headerResource.isRequired ? "isRequired: true," : "";
    const depLine = headerResource.deprecated
      ? `deprecated: "${headerResource.deprecated}",`
      : "";
    return `{
      name: "${headerResource.name}",
      summary: "${headerResource.summary}",
      ${reqLine}
      ${depLine}
      type: ${hSystem}${capitalizeFirstLetter(hType)}Type,
    }`;
  }).join(", ") + "]";

  // build url parameters declaration
  const urlParams = "[" + (resource.urlParams || []).map((urlResource: any) => {
    const uSystem = getSystemFromTypeString(urlResource.type);
    const uType = getTypeFromTypeString(urlResource.type);
    return `{
      name: "${urlResource.name}",
      summary: "${urlResource.summary}",
      type: ${uSystem}${capitalizeFirstLetter(uType)}Type,
    }`;
  }).join(", ") + "]";

  // build query parameters declaration
  const queryParams = "[" + queryParamNames.map((qp: any) => {
    const qpResource = allResources.find((r) =>
      r["$schema"] === queryParamSchemaUrl && r.name === qp
    );
    if (!qpResource) {
      throw new Error(
        `Cannot find query param ${qp} on ${method.operationId}.`,
      );
    }
    const qpSystem = getSystemFromTypeString(qpResource.type);
    const qpType = getTypeFromTypeString(qpResource.type);
    const depLine = qpResource.deprecated
      ? `deprecated: "${qpResource.deprecated}",`
      : "";
    return `{
      name: "${qpResource.name}",
      summary: "${qpResource.summary}",
      ${depLine}
      type: ${qpSystem}${capitalizeFirstLetter(qpType)}Type,
    }`;
  }).join(", ") + "]";

  // build outbound headers declaration
  const outHeaders = "[" + responseHeaderNames.map((h: any) => {
    const outHeaderResource = allResources.find((r) =>
      r["$schema"] === outboundHeaderSchemaUrl && r.name === h
    );
    if (!outHeaderResource) {
      throw new Error(`Cannot find out header ${h} on ${method.operationId}.`);
    }
    const hSystem = getSystemFromTypeString(outHeaderResource.type);
    const hType = getTypeFromTypeString(outHeaderResource.type);
    const gtdLine = outHeaderResource.isGuaranteed ? "isGuaranteed: true," : "";
    const depLine = outHeaderResource.deprecated
      ? `deprecated: "${outHeaderResource.deprecated}",`
      : "";
    return `{
      name: "${outHeaderResource.name}",
      summary: "${outHeaderResource.summary}",
      ${gtdLine}
      ${depLine}
      type: ${hSystem}${capitalizeFirstLetter(hType)}Type,
    }`;
  }).join(", ") + "]";

  return {
    name: method.operationId,
    exported: true,
    outputGeneration: 2,
    typeName: `Operation<
      ${requestBodyTypeParam},
      ${responseBodyTypeParam},
      ${stringArrayToTypescriptUnion(urlParamNames)},
      ${stringArrayToTypescriptUnion(headerNames)},
      ${stringArrayToTypescriptUnion(queryParamNames)},
      ${stringArrayToTypescriptUnion(responseHeaderNames)}
    >`,
    value: `{
      method: "${method.method}",
      name: "${method.name}",
      ${summaryLine}
      operationId: "${method.operationId}",
      urlPattern: "${resource.urlPattern}",
      requestUrlParams: ${urlParams},
      requestHeaders: ${headers},
      requestQueryParams: ${queryParams},
      ${requestBodyTypeLine}
      ${responseBodyTypeLine}
      responseHeaders: ${outHeaders},
      ${responseSuccessCodeLine}
      ${responseFailureDefsLine}
      ${deprecatedLine}
      handler: () => {
        throw new OperationError(
          501,
          "NOT_IMPLEMENTED",
          "This route has not been implemented."
        )
      },
      tags: ${JSON.stringify(resource.tags || [])}
    }`,
  };
}
