import {
  JsonotronTypeDef,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  convertServicePathToOakPath,
  getJsonotronTypeFormalName,
  getJsonotronTypeUnderlyingTypescriptType,
  getJsonotronTypeValidationFuncName,
  getServicePathParameters,
  resolveJsonotronType,
} from "../utils/index.ts";

/**
 * Generates an Oak Router operation from the given service operation.
 * Missing query params, headers and cookies are treated as 'undefined'
 * so that they can be passed to the operation input objects (___Props)
 * and still support optional values.  It's possible that these values
 * could be JSON-parsed to return null.  The validation functions should
 * reject those as only RecordType-properties are nullable.
 * @param method The HTTP verb.
 * @param path The path of the operation.
 * @param op The operation definition.
 * @param types An array of Jsonotron types.
 */
export function generateOakRouterOperation(
  method: string,
  path: ServicePath,
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  const oakPath = convertServicePathToOakPath(path.relativeUrl).replaceAll(
    "\\",
    "\\\\",
  );

  const urlParamInvocationParameters: string[] = [];

  lines.push(`.${method}("${oakPath}", async (ctx) => {`);

  for (const urlParam of getServicePathParameters(path.relativeUrl)) {
    const urlParamTypeDef = resolveJsonotronType(urlParam.type, types);

    if (!urlParamTypeDef) {
      throw new Error(
        `Type ${urlParam.type} of url param ${urlParam.name} used
        for ${method} operation of "${path.relativeUrl}" could not be resolved.`,
      );
    }

    if (urlParamTypeDef.kind === "float" || urlParamTypeDef.kind === "int") {
      lines.push(`
        const ${urlParam.name}ParamTemp = parseFloat(ctx.params["${urlParam.name}"]);
        const ${urlParam.name}Param = isNaN(${urlParam.name}ParamTemp)
          ? ctx.params["${urlParam.name}"]
          : ${urlParam.name}ParamTemp`);
    } else {
      lines.push(
        `const ${urlParam.name}Param = ctx.params["${urlParam.name}"] as string;`,
      );
    }

    lines.push(`
      const ${urlParam.name}ValidationErrors = ${
      getJsonotronTypeValidationFuncName(urlParamTypeDef, false)
    }(
        ${urlParam.name}Param,
        "urlParams.${urlParam.name}",
      );

      if (${urlParam.name}ValidationErrors.length > 0) {
        throw new ServiceInputValidationError("Validation of url parameter ${urlParam.name} failed.", {
          validationErrors: ${urlParam.name}ValidationErrors,
        })
      }
    `);

    const urlParamTypeCast =
      urlParamTypeDef.kind === "float" || urlParamTypeDef.kind === "int"
        ? " as number"
        : "";

    urlParamInvocationParameters.push(
      `    ${urlParam.name}: ${urlParam.name}Param${urlParamTypeCast},`,
    );
  }

  const queryParameters: string[] = [];

  if (Array.isArray(op.requestQueryParams)) {
    for (const queryParam of op.requestQueryParams) {
      const queryParamVar = `queryParam${
        capitalizeFirstLetter(queryParam.name)
      }`;
      const queryParamType = resolveJsonotronType(queryParam.paramType, types);

      if (!queryParamType) {
        throw new Error(
          `Unable to resolve query param type ${queryParam.paramType} for query param ${queryParam.name}.`,
        );
      }

      const queryParamUnderlyingType = getJsonotronTypeUnderlyingTypescriptType(
        queryParamType,
      );

      if (queryParamType.kind === "string" || queryParamType.kind === "enum") {
        lines.push(`
          const ${queryParamVar} = ctx.request.url.searchParams.has("${queryParam.name}")
            ? ctx.request.url.searchParams.get("${queryParam.name}") || ""
            : undefined
        `);
      } else {
        lines.push(`
          const ${queryParamVar} = ctx.request.url.searchParams.has("${queryParam.name}")
            ? safeJsonParse(ctx.request.url.searchParams.get("${queryParam.name}") || "")
            : undefined
        `);
      }

      if (queryParam.isRequired) {
        lines.push(`
          if (${queryParamVar} === undefined) {
            throw new ServiceInputValidationError("Validation of request failed.  Missing or unparsable required query parameter ${queryParam.name}.")
          }
        `);
      }

      lines.push(`
        if (${queryParamVar} !== undefined) {
          const queryParamValidationErrors = ${
        getJsonotronTypeValidationFuncName(queryParamType, false)
      }(${queryParamVar}, "queryParams.${queryParam.name}");
      
          if (queryParamValidationErrors.length > 0) {
            throw new ServiceInputValidationError("Validation of request query param ${queryParam.name} failed.", {
              validationErrors: queryParamValidationErrors
            })
          }
        }
      `);

      queryParameters.push(
        `${queryParam.name}: ${queryParamVar} as ${queryParamUnderlyingType},`,
      );
    }
  }

  const bodyParameters: string[] = [];

  if (op.requestBodyType) {
    const bodyTypeDef = resolveJsonotronType(op.requestBodyType, types);

    if (!bodyTypeDef) {
      throw new Error(
        `Body type ${op.requestBodyType} used for ${method} operation
        of "${path.relativeUrl}" could not be resolved.`,
      );
    }

    if (bodyTypeDef.kind !== "record") {
      throw new Error(
        `Body type ${op.requestBodyType} used for ${method} operation of "${path.relativeUrl}" must be a record.`,
      );
    }

    lines.push(`
      const body = await getJsonBody(ctx.request);

      if (body === undefined) {
        throw new ServiceInputValidationError("Missing or unparsable JSON body.")
      }

      const bodyValidationErrors = ${
      getJsonotronTypeValidationFuncName(
        bodyTypeDef,
        Boolean(op.requestBodyTypeArray),
      )
    }(body, "body");

      if (bodyValidationErrors.length > 0) {
        throw new ServiceInputValidationError("Validation of request body failed.", {
          validationErrors: bodyValidationErrors
        })
      }`);

    bodyParameters.push(
      `body: body as ${getJsonotronTypeFormalName(bodyTypeDef)},`,
    );
  } else if (Array.isArray(op.requestParams) && op.requestParams.length > 0) {
    lines.push(`
      const body = await getJsonBody(ctx.request) as any;

      if (body === undefined) {
        throw new ServiceInputValidationError(
          "Missing or unparsable JSON body.",
        );
      }
    `);

    for (const bodyParam of op.requestParams) {
      const bodyParamVar = `bodyParam${capitalizeFirstLetter(bodyParam.name)}`;
      const bodyParamType = resolveJsonotronType(bodyParam.paramType, types);

      if (!bodyParamType) {
        throw new Error(
          `Unable to resolve body param type ${bodyParam.paramType} for body param ${bodyParam.name}.`,
        );
      }

      const bodyParamUnderlyingType = getJsonotronTypeUnderlyingTypescriptType(
        bodyParamType,
      );

      lines.push(`
        const ${bodyParamVar} = body.${bodyParam.name};
      `);

      if (!bodyParam.isNullable) {
        lines.push(`
          if (${bodyParamVar} === null) {
            throw new ServiceInputValidationError("Validation of request failed.  Body parameter ${bodyParam.name} cannot be null.")
          }
        `);
      }

      if (bodyParam.isRequired) {
        lines.push(`
          if (${bodyParamVar} === undefined) {
            throw new ServiceInputValidationError("Validation of request failed.  Missing body parameter ${bodyParam.name}.")
          }
        `);
      }

      lines.push(`
        if (${bodyParamVar} !== undefined && ${bodyParamVar} !== null) {
          const bodyParamValidationErrors = ${
        getJsonotronTypeValidationFuncName(
          bodyParamType,
          Boolean(bodyParam.isArray),
        )
      }(${bodyParamVar}, "body.${bodyParam.name}");
      
          if (bodyParamValidationErrors.length > 0) {
            throw new ServiceInputValidationError("Validation of request failed.  Invalid body parameter ${bodyParam.name}.", {
              validationErrors: bodyParamValidationErrors
            })
          }
        }
      `);

      const arrayness = bodyParam.isArray ? "[]" : ""

      bodyParameters.push(
        `${bodyParam.name}: ${bodyParamVar} as ${bodyParamUnderlyingType}${arrayness},`,
      );
    }
  }

  const headerParameters: string[] = [];

  if (Array.isArray(op.requestHeaders)) {
    for (const header of op.requestHeaders) {
      const headerVar = `header${capitalizeFirstLetter(header.name)}`;
      const headerType = resolveJsonotronType(header.headerType, types);
      const headerErrorName = header.isAuthorisationHeader
        ? "ServiceAuthorisationHeaderError"
        : "ServiceInputValidationError";

      if (!headerType) {
        throw new Error(
          `Unable to resolve header type ${header.headerType} for header ${header.httpName}.`,
        );
      }

      const headerUnderlyingType = getJsonotronTypeUnderlyingTypescriptType(
        headerType,
      );

      if (headerType.kind === "string" || headerType.kind === "enum") {
        lines.push(`
          const ${headerVar} = ctx.request.headers.has("${header.httpName}")
            ? ctx.request.headers.get("${header.httpName}") || ""
            : undefined
        `);
      } else {
        lines.push(`
          const ${headerVar} = ctx.request.headers.has("${header.httpName}")
            ? safeJsonParse(ctx.request.headers.get("${header.httpName}") || "")
            : undefined
        `);
      }

      if (header.isRequired) {
        lines.push(`
          if (${headerVar} === undefined) {
            throw new ${headerErrorName}("Validation of request failed.  Missing or unparsable required header ${header.httpName}.")
          }
        `);
      }

      lines.push(`
        if (${headerVar} !== undefined) {
          const headerValidationErrors = ${
        getJsonotronTypeValidationFuncName(headerType, false)
      }(${headerVar}, "header.${header.httpName}");
      
          if (headerValidationErrors.length > 0) {
            throw new ${headerErrorName}("Validation of request header ${header.httpName} failed.", {
              validationErrors: headerValidationErrors
            })
          }
        }
      `);

      headerParameters.push(
        `${header.name}: ${headerVar} as ${headerUnderlyingType},`,
      );
    }
  }

  const cookieParameters: string[] = [];

  if (Array.isArray(op.requestCookies)) {
    for (const cookies of op.requestCookies) {
      const cookieVar = `cookie${capitalizeFirstLetter(cookies.name)}`;
      const cookieType = resolveJsonotronType(cookies.cookieType, types);

      if (!cookieType) {
        throw new Error(
          `Unable to resolve header type ${cookies.cookieType} for header ${cookies.name}.`,
        );
      }

      const cookieUnderlyingType = getJsonotronTypeUnderlyingTypescriptType(
        cookieType,
      );

      if (cookieType.kind === "string" || cookieType.kind === "enum") {
        lines.push(`
          const ${cookieVar} = ctx.cookies.get("${cookies.name}")
        `);
      } else {
        lines.push(`
          const ${cookieVar} = await safeJsonParse(ctx.cookies.get("${cookies.name}") || "")
        `);
      }

      if (cookies.isRequired) {
        lines.push(`
          if (${cookieVar} === undefined) {
            throw new ServiceInputValidationError("Validation of request failed.  Missing or unparsable required cookie ${cookies.name}.)
          }
        `);
      }

      lines.push(`
        if (${cookieVar} !== undefined) {
          const cookieValidationErrors = ${
        getJsonotronTypeValidationFuncName(cookieType, false)
      }(${cookieVar}, "cookies.${cookies.name}");
      
          if (cookieValidationErrors.length > 0) {
            throw new ServiceInputValidationError("Validation of request cookie failed.", {
              validationErrors: cookieValidationErrors
            })
          }
        }
      `);

      cookieParameters.push(
        `${cookies.name}: ${cookieVar} as ${cookieUnderlyingType},`,
      );
    }
  }

  const propsRequired = urlParamInvocationParameters.length > 0 ||
    queryParameters.length > 0 ||
    bodyParameters.length > 0 ||
    headerParameters.length > 0 ||
    cookieParameters.length > 0;

  const resultRequired = op.responseBodyType ||
    (Array.isArray(op.responseHeaders) && op.responseHeaders.length > 0);

  if (resultRequired) {
    lines.push("const result = ");
  }

  lines.push(`await props.${op.operationName}(`);

  if (propsRequired) {
    lines.push(`{
      ${urlParamInvocationParameters.join("\n")}
      ${queryParameters.join("\n")}
      ${bodyParameters.join("\n")}
      ${headerParameters.join("\n")}
      ${cookieParameters.join("\n")}
    }`);
  }

  lines.push(");");

  if (resultRequired) {
    if (op.responseBodyType) {
      const resultTypeDef = resolveJsonotronType(op.responseBodyType, types);

      if (!resultTypeDef) {
        throw new Error(
          `Result type ${op.responseBodyType} used for ${method} operation
          of "${path.relativeUrl}" could not be resolved.`,
        );
      }

      if (resultTypeDef.kind !== "record") {
        throw new Error(
          `Result type ${op.responseBodyType} used for ${method} operation of "${path.relativeUrl}" must be a record.`,
        );
      }

      lines.push(`
        const resultValidationErrors = ${
        getJsonotronTypeValidationFuncName(
          resultTypeDef,
          Boolean(op.responseBodyTypeArray),
        )
      }(
          result.body,
          "result",
        );

        if (resultValidationErrors.length > 0) {
          throw new ServiceOutputValidationError("Validation of response body failed.", {
            validationErrors: resultValidationErrors
          })
        }

        ctx.response.body = result.body;
      `);
    }

    if (Array.isArray(op.responseHeaders)) {
      for (const header of op.responseHeaders) {
        lines.push(`
          if (result.${header.name}) {
            ctx.response.headers.append(
              "${header.httpName.toLowerCase()}",
              JSON.stringify(result.${header.name}, null, 2)
            );
          }
        `);
      }
    }
  }

  lines.push(`
    ctx.response.status = ${op.responseSuccessCode};
  `);

  lines.push("})");

  return lines;
}
