import {
  JsonotronTypeDef,
  Service,
  ServicePathOperation,
} from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getJsonotronTypeFormalName,
  resolveJsonotronType,
} from "../utils/index.ts";

export function generateRequestBodiesForOperations(
  service: Service,
  types: JsonotronTypeDef[],
): Record<string, unknown> {
  const requestBodies: Record<string, unknown> = {};

  for (const path of service.paths) {
    if (path.delete && path.delete.requestBodyType) {
      Object.assign(
        requestBodies,
        generateRequestBodyForOperation(path.delete, types),
      );
    }

    if (path.get && path.get.requestBodyType) {
      Object.assign(
        requestBodies,
        generateRequestBodyForOperation(path.get, types),
      );
    }

    if (path.patch && path.patch.requestBodyType) {
      Object.assign(
        requestBodies,
        generateRequestBodyForOperation(path.patch, types),
      );
    }

    if (path.post && path.post.requestBodyType) {
      Object.assign(
        requestBodies,
        generateRequestBodyForOperation(path.post, types),
      );
    }

    if (path.put && path.put.requestBodyType) {
      Object.assign(
        requestBodies,
        generateRequestBodyForOperation(path.put, types),
      );
    }
  }

  return requestBodies;
}

function generateRequestBodyForOperation(
  op: ServicePathOperation,
  types: JsonotronTypeDef[],
) {
  const deleteReqBodyType = resolveJsonotronType(
    op.requestBodyType as string,
    types,
  );

  if (deleteReqBodyType) {
    const deleteReqBodyTypeName = `${
      capitalizeFirstLetter(op.operationName)
    }RequestBody`;

    return {
      [deleteReqBodyTypeName]: {
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${
                getJsonotronTypeFormalName(deleteReqBodyType)
              }`,
            },
          },
        },
      },
    };
  } else {
    return {};
  }
}
