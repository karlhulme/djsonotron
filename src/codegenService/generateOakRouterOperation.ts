import {
  JsonotronTypeDef,
  RecordTypeDef,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  convertJsonotronPathToOakPath,
  getJsonotronTypeInterfaceName,
  getJsonotronTypeValidationFuncName,
  getPathParameters,
  resolveJsonotronType,
} from "../utils/index.ts";

export function generateOakRouterOperation(
  method: string,
  path: ServicePath,
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  const oakPath = convertJsonotronPathToOakPath(path.path);

  const urlParamInvocationParameters: string[] = [];
  let queryInvocationParameter = "";
  let bodyInvocationParameter = "";

  lines.push(`.${method}("${oakPath}", async (ctx) => {`);

  for (const urlParam of getPathParameters(path.path)) {
    const urlParamTypeDef = resolveJsonotronType(urlParam.type, types);

    if (!urlParamTypeDef) {
      throw new Error(
        `Type ${urlParam.type} of url param ${urlParam.name} used
        for ${method} operation of "${path.path}" could not be resolved.`,
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
        `const ${urlParam.name}Param = ctx.params["${urlParam.name}"];`,
      );
    }

    lines.push(`
      const ${urlParam.name}ValidationErrors = ${
      getJsonotronTypeValidationFuncName(urlParamTypeDef)
    }(
        ${urlParam.name}Param,
        "urlParams.${urlParam.name}",
      );

      if (${urlParam.name}ValidationErrors.length > 0) {
        ctx.throw(Status.BadRequest, "Validation of url parameters failed.", {
          data: {
            urlParameterValidationErrors: ${urlParam.name}ValidationErrors,
          },
        });
      }
    `);

    urlParamInvocationParameters.push(
      `    ${urlParam.name}: ${urlParam.name}Param,`,
    );
  }

  if (op.requestQueryType) {
    const queryTypeDef = resolveJsonotronType(op.requestQueryType, types);

    if (!queryTypeDef) {
      throw new Error(
        `Query type ${op.requestQueryType} used for ${method} operation
        of "${path.path}" could not be resolved.`,
      );
    }

    if (queryTypeDef.kind !== "record") {
      throw new Error(
        `Query type ${op.requestQueryType} used for ${method} operation of "${path.path}" must be a record.`,
      );
    }

    lines.push(`
      // deno-lint-ignore no-explicit-any
      const query: any = {};`);

    const queryTypeDefRecord = queryTypeDef as RecordTypeDef;

    for (const prop of queryTypeDefRecord.properties) {
      const propTypeDef = resolveJsonotronType(prop.propertyType, types);

      if (!propTypeDef) {
        throw new Error(
          `Type ${prop.propertyType} used for ${prop.name} property of ${queryTypeDefRecord.name} record could not be resolved.`,
        );
      }

      lines.push(`if (ctx.request.url.searchParams.has("${prop.name}")) {`);

      if (propTypeDef.kind === "bool") {
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get("${prop.name}") as string;
          const boolValue = rawValue.toLowerCase();

          if (boolValue === "true" || boolValue === "1") {
            query.${prop.name} = true;
          } else if (boolValue === "false" || boolValue === "0") {
            query.${prop.name} = false;
          } else {
            query.${prop.name} = boolValue;
          }
        `);
      } else if (propTypeDef.kind === "enum") {
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get(
            "${prop.name}",
          ) as string;
          query.${prop.name} = decodeURIComponent(rawValue);
        `);
      } else if (propTypeDef.kind === "float" || propTypeDef.kind === "int") {
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get("${prop.name}") as string;
          const numValue = parseFloat(rawValue);
          if (isNaN(numValue)) {
            query.${prop.name} = rawValue;
          } else {
            query.${prop.name} = numValue;
          }
        `);
      } else if (
        propTypeDef.kind === "object" || propTypeDef.kind === "record"
      ) {
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get("${prop.name}") as string;
          const objValue = safeJsonParse(decodeURIComponent(rawValue));
          query.${prop.name} = objValue === null ? rawValue : objValue;
        `);
      } else { // strings (and default/catch-all)
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get("${prop.name}") as string;
          query.${prop.name} = decodeURIComponent(rawValue);
        `);
      }

      lines.push(`}`);
    }

    lines.push(`
      const queryValidationErrors = ${
      getJsonotronTypeValidationFuncName(queryTypeDef)
    }(
        query,
        "query",
      );

      if (queryValidationErrors.length > 0) {
        ctx.throw(Status.BadRequest, "Validation of request query failed.", {
          data: {
            queryValidationErrors,
          },
        });
      }
    `);

    queryInvocationParameter = `query: query as ${
      getJsonotronTypeInterfaceName(queryTypeDef)
    },`;
  }

  if (op.requestBodyType) {
    const bodyTypeDef = resolveJsonotronType(op.requestBodyType, types);

    if (!bodyTypeDef) {
      throw new Error(
        `Body type ${op.requestBodyType} used for ${method} operation
        of "${path.path}" could not be resolved.`,
      );
    }

    if (bodyTypeDef.kind !== "record") {
      throw new Error(
        `Body type ${op.requestBodyType} used for ${method} operation of "${path.path}" must be a record.`,
      );
    }

    lines.push(`
      const body = await getJsonBody(ctx.request);

      if (!body) {
        ctx.throw(Status.BadRequest, "Unable to parse JSON body.");
      }

      const bodyValidationErrors = ${
      getJsonotronTypeValidationFuncName(bodyTypeDef)
    }(body, "body");

      if (bodyValidationErrors.length > 0) {
        ctx.throw(Status.BadRequest, "Validation of request body failed.", {
          data: {
            bodyValidationErrors,
          },
        });
      }`);

    bodyInvocationParameter = `body: body as ${
      getJsonotronTypeInterfaceName(bodyTypeDef)
    },`;
  }

  lines.push(`
    const result = await props.${op.operationName}({
      ${urlParamInvocationParameters.join("\n")}
      ${queryInvocationParameter}
      ${bodyInvocationParameter}
      getHeader: ctx.request.headers.get,
      getCookie: ctx.cookies.get,
    });
  `);

  if (op.responseBodyType) {
    const resultTypeDef = resolveJsonotronType(op.responseBodyType, types);

    if (!resultTypeDef) {
      throw new Error(
        `Result type ${op.responseBodyType} used for ${method} operation
        of "${path.path}" could not be resolved.`,
      );
    }

    if (resultTypeDef.kind !== "record") {
      throw new Error(
        `Result type ${op.responseBodyType} used for ${method} operation of "${path.path}" must be a record.`,
      );
    }

    lines.push(`
      const resultValidationErrors = ${
      getJsonotronTypeValidationFuncName(resultTypeDef)
    }(
        result.body,
        "result",
      );

      if (resultValidationErrors.length > 0) {
        ctx.throw(
          Status.InternalServerError,
          "Validation of result failed.",
          {
            data: {
              resultValidationErrors,
            },
          },
        );
      }

      ctx.response.body = result.body;
    `);
  }

  lines.push(`
    for (const header of result.headers) {
      ctx.response.headers.append(
        header.name.toLowerCase(),
        header.value,
      );
    }
  `);

  lines.push("})");

  return lines;
}
