import { Service } from "../interfaces/index.ts";
import { convertRecordTypeNameToInterfaceName } from "../utils/index.ts";

export function getTypeNamesReferencedByService(service: Service) {
  const typeNames: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      if (path.delete.requestBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.delete.requestBodyType),
        );
      }

      if (path.delete.requestQueryType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.delete.requestQueryType),
        );
      }

      if (path.delete.responseBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.delete.responseBodyType),
        );
      }
    }

    if (path.get) {
      if (path.get.requestBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.get.requestBodyType),
        );
      }

      if (path.get.requestQueryType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.get.requestQueryType),
        );
      }

      if (path.get.responseBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.get.responseBodyType),
        );
      }
    }

    if (path.patch) {
      if (path.patch.requestBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.patch.requestBodyType),
        );
      }

      if (path.patch.requestQueryType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.patch.requestQueryType),
        );
      }

      if (path.patch.responseBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.patch.responseBodyType),
        );
      }
    }

    if (path.post) {
      if (path.post.requestBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.post.requestBodyType),
        );
      }

      if (path.post.requestQueryType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.post.requestQueryType),
        );
      }

      if (path.post.responseBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.post.responseBodyType),
        );
      }
    }

    if (path.put) {
      if (path.put.requestBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.put.requestBodyType),
        );
      }

      if (path.put.requestQueryType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.put.requestQueryType),
        );
      }

      if (path.put.responseBodyType) {
        typeNames.push(
          convertRecordTypeNameToInterfaceName(path.put.responseBodyType),
        );
      }
    }
  }

  return typeNames;
}
