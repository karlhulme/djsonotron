import {
  OpenApiSpecComponentSchema,
  OpenApiSpecComponentSchemaProperty,
} from "../../deps.ts";
import {
  JsonotronTypeDef,
  Service,
  ServicePathOperation,
} from "../interfaces/index.ts";
import { capitalizeFirstLetter, resolveJsonotronType } from "../utils/index.ts";
import {
  generateServicePathJsonSchemaForJsonotronTypeDef,
} from "./generateServicePathJsonSchemaForJsonotronTypeDef.ts";

export function generateJsonSchemasForRequestBodyParams(
  service: Service,
  types: JsonotronTypeDef[],
): Record<string, OpenApiSpecComponentSchema> {
  const schemas: Record<string, OpenApiSpecComponentSchema> = {};

  for (const path of service.paths) {
    const ops: ServicePathOperation[] = [];

    if (path.delete) ops.push(path.delete);
    if (path.get) ops.push(path.get);
    if (path.patch) ops.push(path.patch);
    if (path.post) ops.push(path.post);
    if (path.put) ops.push(path.put);

    for (const op of ops) {
      if (Array.isArray(op.requestParams) && op.requestParams.length > 0) {
        const schemaName = `${
          capitalizeFirstLetter(op.operationName)
        }RequestBody`;

        schemas[schemaName] = {
          type: "object",
          description:
            `The request body for the ${op.operationName} operation.`,
          properties: op.requestParams.reduce((agg, cur) => {
            const paramType = resolveJsonotronType(cur.paramType, types);

            agg[cur.name] = generateServicePathJsonSchemaForJsonotronTypeDef(
              cur.summary,
              cur.deprecation,
              paramType,
              Boolean(cur.isNullable),
              true,
            );

            return agg;
          }, {} as Record<string, OpenApiSpecComponentSchemaProperty>),
          required: op.requestParams
            .filter((p) => p.isRequired)
            .map((p) => p.name),
        };
      }
    }
  }

  return schemas;
}
