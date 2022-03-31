import {
  JsonotronTypeDef,
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

    // loads of code to parse the query params
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
