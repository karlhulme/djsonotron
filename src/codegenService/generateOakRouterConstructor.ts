import {
  JsonotronTypeDef,
  RecordTypeDef,
  Service,
  ServicePath,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  convertRecordTypeNameToInterfaceName,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

export function generateOakRouterConstructor(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  for (const path of service.paths) {
    lines.push(...generateOakRouterPath(path, types));
  }

  return [`export function createRouter(props: CreateRouterProps) {
    const router = new Router();
    router
    ${lines.join("\n")}
    return router
  }`];
}

export function generateOakRouterPath(
  path: ServicePath,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  if (path.delete) {
    lines.push(
      ...generateOakRouterOperation("delete", path, path.delete, types),
    );
  }

  if (path.get) {
    lines.push(
      ...generateOakRouterOperation("get", path, path.get, types),
    );
  }

  if (path.patch) {
    lines.push(
      ...generateOakRouterOperation("patch", path, path.patch, types),
    );
  }

  if (path.post) {
    lines.push(
      ...generateOakRouterOperation("post", path, path.post, types),
    );
  }

  if (path.put) {
    lines.push(
      ...generateOakRouterOperation("put", path, path.put, types),
    );
  }

  return lines;
}

export function generateOakRouterOperation(
  method: string,
  path: ServicePath,
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  lines.push(`.${method}("${path.path}", async (ctx) => {`);

  // check for url params and parse those out first

  if (op.requestQueryType) {
    const queryTypeName = convertRecordTypeNameToInterfaceName(
      op.requestQueryType,
    );

    lines.push(`
      // deno-lint-ignore no-explicit-any
      const query: any = {};`);

    const queryTypeDefSystem = getSystemFromTypeString(op.requestQueryType);
    const queryTypeDefName = getTypeFromTypeString(op.requestQueryType);
    const queryTypeDef = types.find((t) =>
      t.system === queryTypeDefSystem && t.name === queryTypeDefName
    );

    if (!queryTypeDef) {
      throw new Error(
        `Type ${op.requestQueryType} used for ${method} operation of "${path.path}" could not be resolved.`,
      );
    }

    if (queryTypeDef.kind !== "record") {
      throw new Error(
        `Type ${op.requestQueryType} used for ${method} operation of "${path.path}" must be a record.`,
      );
    }

    const queryTypeDefRecord = queryTypeDef as RecordTypeDef;

    for (const prop of queryTypeDefRecord.properties) {
      const propSystem = getSystemFromTypeString(prop.propertyType);
      const propTypeName = getTypeFromTypeString(prop.propertyType);
      const propTypeDef = types.find((t) =>
        t.system === propSystem && t.name === propTypeName
      );

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
        `)
      } else if (propTypeDef.kind === "float" || propTypeDef.kind === "int") {
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get("${prop.name}") as string;
          const numValue = parseFloat(rawValue);
          if (isNaN(numValue)) {
            query.${prop.name} = rawValue;
          } else {
            query.${prop.name} = numValue;
          }
        `)
      } else if (propTypeDef.kind === "object" || propTypeDef.kind === "record") {
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get("${prop.name}") as string;
          const objValue = safeJsonParse(decodeURIComponent(rawValue));
          query.${prop.name} = objValue === null ? rawValue : objValue;
        `)
      } else { // strings (and default/catch-all)
        lines.push(`
          const rawValue = ctx.request.url.searchParams.get("${prop.name}") as string;
          query.${prop.name} = decodeURIComponent(rawValue);
        `)
      }

      lines.push(`}`);
    }

    lines.push(`
      const queryValidationErrors = validate${queryTypeName}(
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
  }

  if (op.requestBodyType) {
    const bodyTypeName = convertRecordTypeNameToInterfaceName(
      op.requestBodyType,
    );

    lines.push(`
      const body = await getJsonBody(ctx.request);

      if (!body) {
        ctx.throw(Status.BadRequest, "Unable to parse JSON body.");
      }

      const bodyValidationErrors = validate${bodyTypeName}(body, "body");

      if (bodyValidationErrors.length > 0) {
        ctx.throw(Status.BadRequest, "Validation of request body failed.", {
          data: {
            bodyValidationErrors,
          },
        });
      }`);
  }

  const invocationQueryParameter = op.requestQueryType
    ? `query: query as ${
      convertRecordTypeNameToInterfaceName(op.requestQueryType)
    },`
    : "";

  const invocationBodyParameter = op.requestBodyType
    ? `body: body as ${
      convertRecordTypeNameToInterfaceName(op.requestBodyType)
    },`
    : "";

  lines.push(`
    const result = await props.${op.operationName}({
      ${invocationQueryParameter}
      ${invocationBodyParameter}
      getHeader: ctx.request.headers.get,
      getCookie: ctx.cookies.get,
    });
  `);

  if (op.responseBodyType) {
    const resultTypeName = convertRecordTypeNameToInterfaceName(
      op.responseBodyType,
    );

    lines.push(`
      const resultValidationErrors = validate${resultTypeName}(
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
