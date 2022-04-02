import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { getPathParameters, resolveJsonotronType } from "../utils/index.ts";

export function getTypeReferencedByService(
  service: Service,
  types: JsonotronTypeDef[],
) {
  const typeNames: string[] = [];

  for (const path of service.paths) {
    for (const param of getPathParameters(path.path)) {
      typeNames.push(param.type);
    }

    if (path.delete) {
      if (path.delete.requestBodyType) {
        typeNames.push(path.delete.requestBodyType);
      }

      if (path.delete.requestQueryType) {
        typeNames.push(path.delete.requestQueryType);
      }

      if (path.delete.responseBodyType) {
        typeNames.push(path.delete.responseBodyType);
      }
    }

    if (path.get) {
      if (path.get.requestBodyType) {
        typeNames.push(path.get.requestBodyType);
      }

      if (path.get.requestQueryType) {
        typeNames.push(path.get.requestQueryType);
      }

      if (path.get.responseBodyType) {
        typeNames.push(path.get.responseBodyType);
      }
    }

    if (path.patch) {
      if (path.patch.requestBodyType) {
        typeNames.push(path.patch.requestBodyType);
      }

      if (path.patch.requestQueryType) {
        typeNames.push(path.patch.requestQueryType);
      }

      if (path.patch.responseBodyType) {
        typeNames.push(path.patch.responseBodyType);
      }
    }

    if (path.post) {
      if (path.post.requestBodyType) {
        typeNames.push(path.post.requestBodyType);
      }

      if (path.post.requestQueryType) {
        typeNames.push(path.post.requestQueryType);
      }

      if (path.post.responseBodyType) {
        typeNames.push(path.post.responseBodyType);
      }
    }

    if (path.put) {
      if (path.put.requestBodyType) {
        typeNames.push(path.put.requestBodyType);
      }

      if (path.put.requestQueryType) {
        typeNames.push(path.put.requestQueryType);
      }

      if (path.put.responseBodyType) {
        typeNames.push(path.put.responseBodyType);
      }
    }
  }

  const referencedTypes: JsonotronTypeDef[] = [];

  for (const typeName of typeNames) {
    const resolvedType = resolveJsonotronType(typeName, types);

    if (resolvedType && !referencedTypes.includes(resolvedType)) {
      referencedTypes.push(resolvedType);
    }
  }

  return referencedTypes;
}
