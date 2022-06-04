import { ServicePath } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

/**
 * Generates a series of service paths for given seedDocType.
 * @param system The name of the system to which the request and response types
 * have been assigned.
 * @param seedDocType A seed docType for which service paths are required.
 */
export function generateSengiServicePaths(
  system: string,
  seedDocType: SengiSeedDocType,
) {
  const docTypeRootPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}`,
    summary: seedDocType.summary,

    get: {
      operationName: `selectAll${
        capitalizeFirstLetter(seedDocType.pluralName)
      }`,
      summary: `Retrieve all the ${seedDocType.name} records.`,
      tags: [seedDocType.pluralTitle],
      requestQueryType: `${system}/selectAll${
        capitalizeFirstLetter(seedDocType.pluralName)
      }RequestQuery`,
      responseBodyType: `${system}/select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }Response`,
    },

    patch: {
      operationName: `patch${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Patch a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestBodyType: `${system}/patch${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/patch${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
    },

    post: {
      operationName: `new${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Create a new ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestBodyType: `${system}/new${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/new${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
    },

    put: {
      operationName: `replace${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Replace an existing ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestBodyType: `${system}/replace${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/replace${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
    },
  };

  const docTypeByIdsPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}:byIds`,
    summary: seedDocType.summary,

    get: {
      operationName: `select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }ByIds`,
      summary: `Retrieve ${seedDocType.name} records using ids.`,
      tags: [seedDocType.pluralTitle],
      requestQueryType: `${system}/select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }ByIdsRequestQuery`,
      responseBodyType: `${system}/select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }Response`,
    },
  };

  const docTypeFilterPaths: ServicePath[] = seedDocType.filters.map(
    (filter) => ({
      relativeUrl: `/records/${seedDocType.pluralName}:${filter.name}`,
      summary: filter.summary,
      get: {
        operationName: `select${capitalizeFirstLetter(seedDocType.pluralName)}${
          capitalizeFirstLetter(filter.name)
        }`,
        summary:
          `Retrieve ${seedDocType.name} records using the ${filter.name} filter.`,
        tags: [seedDocType.pluralTitle],
        requestQueryType: `${system}/select${
          capitalizeFirstLetter(seedDocType.pluralName)
        }${capitalizeFirstLetter(filter.name)}RequestQuery`,
        responseBodyType: `${system}/select${
          capitalizeFirstLetter(seedDocType.pluralName)
        }Response`,
      },
    }),
  );

  return [
    docTypeRootPath,
    docTypeByIdsPath,
    ...docTypeFilterPaths,
  ];
}
