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
  let bodyInvocationParameter = "";

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
          const ${queryParamVar} = ctx.request.url.searchParams.get("${queryParam.name}")
        `);
      } else {
        lines.push(`
          const ${queryParamVar} = safeJsonParse(ctx.request.url.searchParams.get("${queryParam.name}") || "")
        `);
      }

      if (queryParam.isRequired) {
        lines.push(`
          if (${queryParamVar} === null) {
            throw new ServiceInputValidationError("Validation of request failed.  Missing required query parameter ${queryParam.name}.")
          }
        `);
      }

      lines.push(`
        if (${queryParamVar} !== null) {
          const queryParamValidationErrors = ${
        getJsonotronTypeValidationFuncName(queryParamType, false)
      }(${queryParamVar}, "queryParams.${queryParam.name}");
      
          if (queryParamValidationErrors.length > 0) {
            throw new ServiceInputValidationError("Validation of request header ${queryParam.name} failed.", {
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

      if (!body) {
        throw new ServiceInputValidationError("Unable to parse JSON body.")
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

    bodyInvocationParameter = `body: body as ${
      getJsonotronTypeFormalName(bodyTypeDef)
    },`;
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
          const ${headerVar} = ctx.request.headers.get("${header.httpName}") || null
        `);
      } else {
        lines.push(`
          const ${headerVar} = safeJsonParse(ctx.request.headers.get("${header.httpName}") || "")
        `);
      }

      if (header.isRequired) {
        lines.push(`
          if (${headerVar} === null) {
            throw new ${headerErrorName}("Validation of request failed.  Missing required header ${header.httpName}.")
          }
        `);
      }

      lines.push(`
        if (${headerVar} !== null) {
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
          const ${cookieVar} = ctx.cookies.get("${cookies.name}") || null
        `);
      } else {
        lines.push(`
          const ${cookieVar} = await safeJsonParse(ctx.cookies.get("${cookies.name}") || "")
        `);
      }

      if (cookies.isRequired) {
        lines.push(`
          if (${cookieVar} === null) {
            throw new ServiceInputValidationError("Validation of request failed.  Missing required cookie ${cookies.name}.)
          }
        `);
      }

      lines.push(`
        if (${cookieVar} !== null) {
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

  const resultRequired = op.responseBodyType ||
    (Array.isArray(op.responseHeaders) && op.responseHeaders.length > 0);

  lines.push(`
    ${resultRequired ? "const result = " : ""} await props.${op.operationName}({
      ${urlParamInvocationParameters.join("\n")}
      ${queryParameters.join("\n")}
      ${bodyInvocationParameter}
      ${headerParameters.join("\n")}
      ${cookieParameters.join("\n")}
    });
  `);

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
