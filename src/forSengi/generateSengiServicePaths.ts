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
  };

  const docTypeRecordPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}/{id:std/uuid}`,
    summary: seedDocType.summary,

    delete: {
      operationName: `delete${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Delete a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestBodyType: `${system}/delete${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/delete${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
    },

    get: {
      operationName: `select${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Retrieve a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestQueryType: `${system}/select${
        capitalizeFirstLetter(seedDocType.name)
      }RequestQuery`,
      responseBodyType: `${system}/select${
        capitalizeFirstLetter(seedDocType.name)
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
    relativeUrl: `/records/${seedDocType.pluralName}\\:byIds`,
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
      relativeUrl: `/records/${seedDocType.pluralName}\\:${filter.name}`,
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

  const docTypeCtorPaths: ServicePath[] = seedDocType.constructors.map(
    (ctor) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${ctor.name}`,
      summary: ctor.summary,
      post: {
        operationName: `create${capitalizeFirstLetter(seedDocType.name)}${
          capitalizeFirstLetter(ctor.name)
        }`,
        summary:
          `Create a new ${seedDocType.name} record using the ${ctor.name} specialised constructor.`,
        tags: [seedDocType.pluralTitle],
        requestBodyType: `${system}/create${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(ctor.name)}RequestBody`,
        responseBodyType: `${system}/create${
          capitalizeFirstLetter(seedDocType.name)
        }Response`,
      },
    }),
  );

  const docTypeOpPaths: ServicePath[] = seedDocType.operations.map(
    (op) => ({
      relativeUrl:
        `/records/${seedDocType.pluralName}/{id:std/uuid}\\:${op.name}`,
      summary: op.summary,
      post: {
        operationName: `operateOn${capitalizeFirstLetter(seedDocType.name)}${
          capitalizeFirstLetter(op.name)
        }`,
        summary:
          `Operate on the ${seedDocType.name} record using the ${op.name} operator.`,
        tags: [seedDocType.pluralTitle],
        requestBodyType: `${system}/operateOn${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(op.name)}RequestBody`,
        responseBodyType: `${system}/operateOn${
          capitalizeFirstLetter(seedDocType.name)
        }Response`,
      },
    }),
  );

  const docTypeQueryPaths: ServicePath[] = seedDocType.queries.map(
    (query) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${query.name}`,
      summary: query.summary,
      get: {
        operationName: `query${capitalizeFirstLetter(seedDocType.pluralName)}${
          capitalizeFirstLetter(query.name)
        }`,
        summary:
          `Perform a query on the ${seedDocType.name} records using the ${query.name} query.`,
        tags: [seedDocType.pluralTitle],
        requestQueryType: `${system}/query${
          capitalizeFirstLetter(seedDocType.pluralName)
        }${capitalizeFirstLetter(query.name)}RequestQuery`,
        responseBodyType: `${system}/query${
          capitalizeFirstLetter(seedDocType.pluralName)
        }${capitalizeFirstLetter(query.name)}Response`,
      },
    }),
  );

  return [
    docTypeRootPath,
    docTypeRecordPath,
    docTypeByIdsPath,
    ...docTypeFilterPaths,
    ...docTypeCtorPaths,
    ...docTypeOpPaths,
    ...docTypeQueryPaths,
  ];
}
