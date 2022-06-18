import {
  JsonotronTypeDef,
  OpenApiSpecParameter,
  OpenApiSpecPathOperation,
  OpenApiSpecPathResponse,
  OpenApiSpecPathResponseHeader,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getJsonotronTypeFormalName,
  resolveJsonotronType,
} from "../utils/index.ts";
import { generateJsonSchemaPropertyForJsonotronProperty } from "./generateJsonSchemaPropertyForJsonotronProperty.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateOpenApiServicePathOperation(
  path: ServicePath,
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
): OpenApiSpecPathOperation {
  const parameters: OpenApiSpecParameter[] = [];

  if (Array.isArray(op.requestQueryParams)) {
    for (const queryParam of op.requestQueryParams) {
      const queryParamType = resolveJsonotronType(queryParam.paramType, types);

      if (queryParamType) {
        parameters.push({
          in: "query",
          name: queryParam.name,
          required: Boolean(queryParam.isRequired),
          deprecated: Boolean(queryParam.deprecation),
          description: generateDescriptionText(
            queryParam.summary,
            queryParam.deprecation,
          ),
          schema: generateJsonSchemaPropertyForJsonotronProperty(
            queryParam.summary,
            queryParam.deprecation,
            queryParamType,
            true,
          ),
        });
      }
    }
  }

  if (Array.isArray(op.requestHeaders)) {
    for (const header of op.requestHeaders) {
      if (!header.isAuthorisationHeader) {
        const headerType = resolveJsonotronType(header.headerType, types);

        if (headerType) {
          parameters.push({
            in: "header",
            name: header.httpName,
            schema: generateJsonSchemaPropertyForJsonotronProperty(
              header.summary,
              header.deprecation,
              headerType,
              true,
            ),
            required: Boolean(header.isRequired),
            deprecated: header.deprecation ? true : undefined,
            description: generateDescriptionText(
              header.summary,
              header.deprecation,
            ),
          });
        }
      }
    }
  }

  if (Array.isArray(op.requestCookies)) {
    for (const cookie of op.requestCookies) {
      const cookieType = resolveJsonotronType(cookie.cookieType, types);

      if (cookieType) {
        parameters.push({
          in: "cookie",
          name: cookie.name,
          schema: generateJsonSchemaPropertyForJsonotronProperty(
            cookie.summary,
            cookie.deprecation,
            cookieType,
            true,
          ),
          required: Boolean(cookie.isRequired),
          deprecated: cookie.deprecation ? true : undefined,
          description: generateDescriptionText(
            cookie.summary,
            cookie.deprecation,
          ),
        });
      }
    }
  }

  const reqBodyName = op.requestBodyType
    ? `${capitalizeFirstLetter(op.operationName)}RequestBody`
    : null;

  const resBodyType = op.responseBodyType
    ? resolveJsonotronType(op.responseBodyType, types)
    : null;

  const successResponse: OpenApiSpecPathResponse = {
    description: "Success",
    content: createOpenApiSpecResponseContent(
      resBodyType,
      Boolean(op.responseBodyTypeArray),
    ),
    headers: op.responseHeaders?.reduce((headers, header) => {
      const headerType = resolveJsonotronType(header.headerType, types);

      if (headerType) {
        headers[header.httpName] = {
          description: generateDescriptionText(
            header.summary,
            header.deprecation,
          ),
          schema: generateJsonSchemaPropertyForJsonotronProperty(
            header.summary,
            header.deprecation,
            headerType,
            true,
          ),
          required: Boolean(header.isGuaranteed),
          deprecated: header.deprecation ? true : undefined,
        };
      }

      return headers;
    }, {} as Record<string, OpenApiSpecPathResponseHeader>),
  };

  return {
    operationId: op.operationName,
    summary: generateDescriptionText(op.summary, op.deprecation),
    deprecated: op.deprecation ? true : undefined,
    tags: op.tags || [],
    requestBody: createOpenApiSpecRequestSchema(
      reqBodyName,
      Boolean(op.requestBodyTypeArray),
    ),
    parameters,
    responses: {
      [op.responseSuccessCode.toString()]: successResponse,
    },
    security: path.requireApiKey
      ? [{
        "apiKeyAuth": [],
      }]
      : [],
  };
}

function createOpenApiSpecRequestSchema(
  formalTypeName: string | null,
  isArray: boolean,
) {
  if (formalTypeName) {
    if (isArray) {
      return {
        type: "array",
        items: {
          $ref: `#/components/requestBodies/${formalTypeName}`,
        },
      };
    } else {
      return {
        $ref: `#/components/requestBodies/${formalTypeName}`,
      };
    }
  } else {
    return undefined;
  }
}

function createOpenApiSpecResponseContent(
  responseType: JsonotronTypeDef | null,
  isArray: boolean,
) {
  if (responseType) {
    if (isArray) {
      return {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: `#/components/schemas/${
                getJsonotronTypeFormalName(responseType)
              }`,
            },
          },
        },
      };
    } else {
      return {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${
              getJsonotronTypeFormalName(responseType)
            }`,
          },
        },
      };
    }
  } else {
    return undefined;
  }
}
