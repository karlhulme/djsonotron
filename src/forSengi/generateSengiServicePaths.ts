import {
  ServicePath,
  ServicePathOperationHeader,
} from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

/**
 * Generates a series of service paths for given seedDocType.
 * @param system The name of the system to which the request and response types
 * have been assigned.
 * @param seedDocType A seed docType for which service paths are required.
 * @param user A fully qualified user type.
 */
export function generateSengiServicePaths(
  system: string,
  seedDocType: SengiSeedDocType,
  user: string,
) {
  const apiKeyHeader: ServicePathOperationHeader = {
    name: "apiKey",
    headerType: "std/mediumString",
    httpName: "x-api-key",
    summary: "An API key that maps to a client definition.",
    isRequired: true,
    isAuthorisationHeader: true,
  };

  const partitionKeyHeader: ServicePathOperationHeader = {
    name: "partitionKey",
    headerType: "std/mediumString",
    httpName: "partition-key",
    summary: "A key that identifies a partition of documents.",
  };

  const userHeader: ServicePathOperationHeader = {
    name: "user",
    headerType: user,
    httpName: "x-user",
    summary:
      `A JSON stringified ${user} object that describes the user making the request.`,
    isRequired: true,
  };

  const docTypeRootPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}`,
    summary: seedDocType.summary,

    get: {
      operationName: `selectAll${
        capitalizeFirstLetter(seedDocType.pluralName)
      }`,
      summary: `Retrieve all the ${seedDocType.name} records.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        partitionKeyHeader,
        userHeader,
      ],
      requestQueryType: `${system}/selectAll${
        capitalizeFirstLetter(seedDocType.pluralName)
      }RequestQuery`,
      responseBodyType: `${system}/select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }Response`,
      responseSuccessCode: 200,
    },

    post: {
      operationName: `new${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Create a new ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        partitionKeyHeader,
        userHeader,
      ],
      requestBodyType: `${system}/new${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/new${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
      responseSuccessCode: 201,
    },
  };

  const docTypeRecordPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}/{id:std/uuid}`,
    summary: seedDocType.summary,

    delete: {
      operationName: `delete${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Delete a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        partitionKeyHeader,
        userHeader,
      ],
      responseBodyType: `${system}/delete${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
      responseSuccessCode: 204,
    },

    get: {
      operationName: `select${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Retrieve a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        partitionKeyHeader,
        userHeader,
      ],
      requestQueryType: `${system}/select${
        capitalizeFirstLetter(seedDocType.name)
      }RequestQuery`,
      responseBodyType: `${system}/select${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
      responseSuccessCode: 200,
    },

    patch: {
      operationName: `patch${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Patch a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        partitionKeyHeader,
        userHeader,
      ],
      requestBodyType: `${system}/patch${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/patch${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
      responseSuccessCode: 200,
    },

    put: {
      operationName: `replace${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Replace an existing ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        partitionKeyHeader,
        userHeader,
      ],
      requestBodyType: `${system}/replace${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/replace${
        capitalizeFirstLetter(seedDocType.name)
      }Response`,
      responseSuccessCode: 200,
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
      requestHeaders: [
        apiKeyHeader,
        partitionKeyHeader,
        userHeader,
      ],
      requestQueryType: `${system}/select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }ByIdsRequestQuery`,
      responseBodyType: `${system}/select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }Response`,
      responseSuccessCode: 200,
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
        summary: filter.summary,
        deprecation: filter.deprecation,
        tags: [seedDocType.pluralTitle],
        requestHeaders: [
          apiKeyHeader,
          partitionKeyHeader,
          userHeader,
        ],
        requestQueryType: `${system}/select${
          capitalizeFirstLetter(seedDocType.pluralName)
        }${capitalizeFirstLetter(filter.name)}RequestQuery`,
        responseBodyType: `${system}/select${
          capitalizeFirstLetter(seedDocType.pluralName)
        }Response`,
        responseSuccessCode: 200,
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
        summary: ctor.summary,
        deprecation: ctor.deprecation,
        tags: [seedDocType.pluralTitle],
        requestHeaders: [
          apiKeyHeader,
          partitionKeyHeader,
          userHeader,
        ],
        requestBodyType: `${system}/create${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(ctor.name)}RequestBody`,
        responseBodyType: `${system}/create${
          capitalizeFirstLetter(seedDocType.name)
        }Response`,
        responseSuccessCode: 201,
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
        summary: op.summary,
        deprecation: op.deprecation,
        tags: [seedDocType.pluralTitle],
        requestHeaders: [
          apiKeyHeader,
          partitionKeyHeader,
          userHeader,
        ],
        requestBodyType: `${system}/operateOn${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(op.name)}RequestBody`,
        responseBodyType: `${system}/operateOn${
          capitalizeFirstLetter(seedDocType.name)
        }Response`,
        responseSuccessCode: 200,
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
        summary: query.summary,
        deprecation: query.deprecation,
        tags: [seedDocType.pluralTitle],
        requestHeaders: [
          apiKeyHeader,
          userHeader,
        ],
        requestQueryType: `${system}/query${
          capitalizeFirstLetter(seedDocType.pluralName)
        }${capitalizeFirstLetter(query.name)}RequestQuery`,
        responseBodyType: `${system}/query${
          capitalizeFirstLetter(seedDocType.pluralName)
        }${capitalizeFirstLetter(query.name)}Response`,
        responseSuccessCode: 200,
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
