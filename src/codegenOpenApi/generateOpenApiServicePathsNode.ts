import {
  JsonotronTypeDef,
  OpenApiSpecPath,
  Service,
} from "../interfaces/index.ts";
import {
  convertServicePathToOpenApiPath,
  getServicePathParameters,
} from "../utils/index.ts";
import { generateOpenApiServicePathOperation } from "./generateOpenApiServicePathOperation.ts";

export function generateOpenApiServicePathsNode(
  service: Service,
  types: JsonotronTypeDef[],
): Record<string, OpenApiSpecPath> {
  const paths: Record<string, OpenApiSpecPath> = {};

  for (const path of service.paths) {
    const pathParams = getServicePathParameters(path.relativeUrl);
    const openApiPath = convertServicePathToOpenApiPath(path.relativeUrl);

    paths[openApiPath] = {
      summary: path.summary,
      description: path.description,
      parameters: pathParams.map((p) => ({
        in: "path",
        schema: {
          type: "string",
        },
        name: p.name,
        required: true,
      })),
      delete: path.delete
        ? generateOpenApiServicePathOperation(path, path.delete, types)
        : undefined,
      get: path.get
        ? generateOpenApiServicePathOperation(path, path.get, types)
        : undefined,
      patch: path.patch
        ? generateOpenApiServicePathOperation(path, path.patch, types)
        : undefined,
      post: path.post
        ? generateOpenApiServicePathOperation(path, path.post, types)
        : undefined,
      put: path.put
        ? generateOpenApiServicePathOperation(path, path.put, types)
        : undefined,
    };
  }

  return paths;
}
