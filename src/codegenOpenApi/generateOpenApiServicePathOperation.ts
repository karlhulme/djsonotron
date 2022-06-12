import {
  JsonotronTypeDef,
  OpenApiSpecParameter,
  OpenApiSpecPathOperation,
  OpenApiSpecPathResponse,
  OpenApiSpecPathResponseHeader,
  RecordTypeDef,
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
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
): OpenApiSpecPathOperation {
  const reqQueryType = op.requestQueryType
    ? resolveJsonotronType(op.requestQueryType, types)
    : null;

  const reqQueryTypeRecord = reqQueryType?.kind === "record"
    ? reqQueryType as RecordTypeDef
    : null;

  // Set the parameters defined on the request query type record.
  const parameters: OpenApiSpecParameter[] = reqQueryTypeRecord
    ? reqQueryTypeRecord.properties.map((p) => ({
      in: "query",
      schema: {
        type: "string",
      },
      name: p.name,
      required: Boolean(p.isRequired),
      description: p.isArray
        ? "Cannot deserialize arrays in top-level query objects.  Change type to non-array or wrap it in an object."
        : p.summary,
    }))
    : [];

  // Add the parameters defined by the request headers.
  if (Array.isArray(op.requestHeaders)) {
    for (const header of op.requestHeaders) {
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

  // Add the parameters defined by the request cookies.
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
    content: resBodyType
      ? {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${
              getJsonotronTypeFormalName(resBodyType)
            }`,
          },
        },
      }
      : undefined,
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
    requestBody: reqBodyName
      ? {
        $ref: `#/components/requestBodies/${reqBodyName}`,
      }
      : undefined,
    parameters,
    responses: {
      [op.responseSuccessCode.toString()]: successResponse,
    },
  };
}
