import {
  JsonotronTypeDef,
  OpenApiSpecPathOperation,
  RecordTypeDef,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getJsonotronTypeFormalName,
  resolveJsonotronType,
} from "../utils/index.ts";

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

  const reqBodyName = op.requestBodyType
    ? `${capitalizeFirstLetter(op.operationName)}RequestBody`
    : null;

  const resBodyType = op.responseBodyType
    ? resolveJsonotronType(op.responseBodyType, types)
    : null;

  return {
    operationId: op.operationName,
    summary: op.summary,
    requestBody: reqBodyName
      ? {
        $ref: `#/components/requestBodies/${reqBodyName}`,
      }
      : undefined,
    parameters: reqQueryTypeRecord
      ? reqQueryTypeRecord.properties.map((p) => ({
        in: "query",
        name: p.name,
        required: Boolean(p.isRequired),
        description: p.summary,
      }))
      : [],
    responses: {
      "2XX": resBodyType
        ? {
          $ref: `#/components/schemas/${
            getJsonotronTypeFormalName(resBodyType)
          }`,
        }
        : {
          $ref: `#/components/schemas/Empty`,
        },
    },
  };
}
