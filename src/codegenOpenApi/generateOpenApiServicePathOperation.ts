import {
  OpenApiSpecPathContent,
  OpenApiSpecPathOperation,
  OpenApiSpecPathOperationSchema,
  OpenApiSpecPathResponseHeader,
} from "../../deps.ts";
import {
  JsonotronTypeDef,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import { capitalizeFirstLetter, resolveJsonotronType } from "../utils/index.ts";
import { generateServicePathJsonSchemaForJsonotronTypeDef } from "./generateServicePathJsonSchemaForJsonotronTypeDef.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateOpenApiServicePathOperation(
  path: ServicePath,
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
): OpenApiSpecPathOperation {
  const openApiOp: OpenApiSpecPathOperation = {
    operationId: op.operationName,
    summary: generateDescriptionText(op.summary, op.deprecation),
    deprecated: op.deprecation ? true : undefined,
    tags: op.tags || [],
    parameters: [],
    responses: {},
    security: [],
  };

  if (path.requireApiKey) {
    openApiOp.security.push({
      "apiKeyAuth": [],
    });
  }

  if (Array.isArray(op.requestQueryParams)) {
    for (const queryParam of op.requestQueryParams) {
      const queryParamType = resolveJsonotronType(queryParam.paramType, types);

      openApiOp.parameters.push({
        in: "query",
        name: queryParam.name,
        required: Boolean(queryParam.isRequired),
        deprecated: Boolean(queryParam.deprecation),
        description: generateDescriptionText(
          queryParam.summary,
          queryParam.deprecation,
        ),
        schema: generateServicePathJsonSchemaForJsonotronTypeDef(
          queryParam.summary,
          queryParam.deprecation,
          queryParamType,
          false,
          true,
        ),
      });
    }
  }

  if (Array.isArray(op.requestHeaders)) {
    for (const header of op.requestHeaders) {
      if (!header.isAuthorisationHeader) {
        const headerType = resolveJsonotronType(header.headerType, types);

        openApiOp.parameters.push({
          in: "header",
          name: header.httpName,
          schema: generateServicePathJsonSchemaForJsonotronTypeDef(
            header.summary,
            header.deprecation,
            headerType,
            false,
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

  if (Array.isArray(op.requestCookies)) {
    for (const cookie of op.requestCookies) {
      const cookieType = resolveJsonotronType(cookie.cookieType, types);

      openApiOp.parameters.push({
        in: "cookie",
        name: cookie.name,
        schema: generateServicePathJsonSchemaForJsonotronTypeDef(
          cookie.summary,
          cookie.deprecation,
          cookieType,
          false,
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

  if (op.requestBodyType) {
    const requestBodyType = resolveJsonotronType(op.requestBodyType, types);

    openApiOp.requestBody = {
      content: createOpenApiSpecContent(
        requestBodyType.summary,
        requestBodyType,
        Boolean(op.requestBodyTypeArray),
      ),
    };
  } else if (Array.isArray(op.requestParams) && op.requestParams.length > 0) {
    openApiOp.requestBody = {
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${
              capitalizeFirstLetter(op.operationName)
            }RequestBody`,
            description: "The body of the request",
          },
        },
      },
    };
  }

  openApiOp.responses[op.responseSuccessCode] = {
    description: "Success.",
  };

  if (op.responseBodyType) {
    const resBodyType = resolveJsonotronType(op.responseBodyType, types);

    openApiOp.responses[op.responseSuccessCode].content =
      createOpenApiSpecContent(
        resBodyType.summary,
        resBodyType,
        Boolean(op.responseBodyTypeArray),
      );
  }

  openApiOp.responses[op.responseSuccessCode].headers = op.responseHeaders
    ?.reduce((headers, header) => {
      const headerType = resolveJsonotronType(header.headerType, types);

      headers[header.httpName] = {
        description: generateDescriptionText(
          header.summary,
          header.deprecation,
        ),
        schema: generateServicePathJsonSchemaForJsonotronTypeDef(
          header.summary,
          header.deprecation,
          headerType,
          false,
          true,
        ),
        required: Boolean(header.isGuaranteed),
        deprecated: header.deprecation ? true : undefined,
      };

      return headers;
    }, {} as Record<string, OpenApiSpecPathResponseHeader>);

  return openApiOp;
}

function createOpenApiSpecContent(
  summary: string,
  typeDef: JsonotronTypeDef,
  isArray: boolean,
): OpenApiSpecPathContent {
  return {
    "application/json": {
      schema: createOpenApiSpecSchema(summary, typeDef, isArray),
    },
  };
}

function createOpenApiSpecSchema(
  summary: string,
  typeDef: JsonotronTypeDef,
  isArray: boolean,
): OpenApiSpecPathOperationSchema {
  const prop = generateServicePathJsonSchemaForJsonotronTypeDef(
    summary,
    undefined,
    typeDef,
    false,
    true,
  );

  if (isArray) {
    return {
      type: "array",
      items: prop,
    };
  } else {
    return prop;
  }
}
