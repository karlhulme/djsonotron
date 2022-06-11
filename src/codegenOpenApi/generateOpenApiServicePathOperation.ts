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

  const reqBodyName = op.requestBodyType
    ? `${capitalizeFirstLetter(op.operationName)}RequestBody`
    : null;

  const resBodyType = op.responseBodyType
    ? resolveJsonotronType(op.responseBodyType, types)
    : null;

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
    parameters: reqQueryTypeRecord
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
      : [],
    responses: {
      [op.responseSuccessCode.toString()]: resBodyType
        ? {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${
                  getJsonotronTypeFormalName(resBodyType)
                }`,
              },
            },
          },
        }
        : {
          description: "Success",
        },
    },
  };
}
