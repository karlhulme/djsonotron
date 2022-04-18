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
        name: p.name,
        required: true,
      })),
      delete: path.delete
        ? generateOpenApiServicePathOperation(path.delete, types)
        : undefined,
      get: path.get
        ? generateOpenApiServicePathOperation(path.get, types)
        : undefined,
      patch: path.patch
        ? generateOpenApiServicePathOperation(path.patch, types)
        : undefined,
      post: path.post
        ? generateOpenApiServicePathOperation(path.post, types)
        : undefined,
      put: path.put
        ? generateOpenApiServicePathOperation(path.put, types)
        : undefined,
    };
  }

  return paths;
}
