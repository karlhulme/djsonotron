import {
  ServicePath,
  ServicePathOperationHeader,
  ServicePathOperationResponseHeader,
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
  // request headers

  const apiKeyHeader: ServicePathOperationHeader = {
    name: "apiKey",
    headerType: "std/mediumString",
    httpName: "x-api-key",
    summary: "An API key that maps to a client definition.",
    isRequired: true,
    isAuthorisationHeader: true,
  };

  const partitionKeyHeaders: ServicePathOperationHeader[] =
    seedDocType.useSinglePartition ? [] : [{
      name: "partitionKey",
      headerType: "std/mediumString",
      httpName: "partition-key",
      summary: "A key that identifies a partition of documents.",
      isRequired: true,
    }];

  const userHeader: ServicePathOperationHeader = {
    name: "user",
    headerType: user,
    httpName: "x-user",
    summary:
      `A JSON stringified ${user} object that describes the user making the request.`,
    isRequired: true,
  };

  const reqVersionHeader: ServicePathOperationHeader = {
    name: "reqVersion",
    headerType: "std/mediumString",
    httpName: "if-match",
    summary:
      `A document will only be updated if it's docVersion property matches the given value.`,
    isRequired: false,
  };

  const operationIdHeader: ServicePathOperationHeader = {
    name: "operationId",
    headerType: "std/uuid",
    httpName: "idempotency-key",
    summary:
      `A unique value for this operation which ensures repeat invocation will not change the underlying resource.`,
    isRequired: false,
  };

  // response headers

  const isDeletedHeader: ServicePathOperationResponseHeader = {
    name: "isDeleted",
    headerType: "std/bool",
    httpName: "is-deleted",
    summary:
      `A value that indicates if the resource was deleted as a consequence of this request.`,
    isGuaranteed: true,
  };

  const isUpdatedHeader: ServicePathOperationResponseHeader = {
    name: "isUpdated",
    headerType: "std/bool",
    httpName: "is-updated",
    summary:
      `A value that indicates if the resource was updated as a consequence of this request.`,
    isGuaranteed: true,
  };

  const isNewHeader: ServicePathOperationResponseHeader = {
    name: "isNew",
    headerType: "std/bool",
    httpName: "is-new",
    summary:
      `A value that indicates if the resource was created as a consequence of this request.`,
    isGuaranteed: true,
  };

  // collection based operations

  const docTypeRootPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}`,
    summary: seedDocType.summary,
    requireApiKey: true,

    get: {
      operationName: `selectAll${
        capitalizeFirstLetter(seedDocType.pluralName)
      }`,
      summary: `Retrieve all the ${seedDocType.name} records.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userHeader,
      ],
      requestQueryType: `${system}/selectAll${
        capitalizeFirstLetter(seedDocType.pluralName)
      }RequestQuery`,
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseBodyTypeArray: true,
      responseSuccessCode: 200,
    },

    post: {
      operationName: `new${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Create a new ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userHeader,
      ],
      requestQueryType: `${system}/new${
        capitalizeFirstLetter(seedDocType.name)
      }RequestQuery`,
      requestBodyType: `${system}/new${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseHeaders: [
        isNewHeader,
      ],
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseSuccessCode: 201,
    },
  };

  // document-based operations

  const docTypeRecordPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}/{id:std/uuid}`,
    summary: seedDocType.summary,
    requireApiKey: true,

    delete: {
      operationName: `delete${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Delete a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userHeader,
      ],
      responseHeaders: [
        isDeletedHeader,
      ],
      responseSuccessCode: 204,
    },

    get: {
      operationName: `select${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Retrieve a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userHeader,
      ],
      requestQueryType: `${system}/select${
        capitalizeFirstLetter(seedDocType.name)
      }RequestQuery`,
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseSuccessCode: 200,
    },

    patch: {
      operationName: `patch${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Patch a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userHeader,
        reqVersionHeader,
        operationIdHeader,
      ],
      requestQueryType: `${system}/patch${
        capitalizeFirstLetter(seedDocType.name)
      }RequestQuery`,
      requestBodyType: `${system}/patch${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseHeaders: [
        isUpdatedHeader,
      ],
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseSuccessCode: 200,
    },

    put: {
      operationName: `replace${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Replace an existing ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userHeader,
      ],
      requestQueryType: `${system}/replace${
        capitalizeFirstLetter(seedDocType.name)
      }RequestQuery`,
      requestBodyType: `${system}/replace${
        capitalizeFirstLetter(seedDocType.name)
      }RequestBody`,
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseSuccessCode: 200,
    },
  };

  // custom verb operations

  const docTypeByIdsPath: ServicePath = {
    relativeUrl: `/records/${seedDocType.pluralName}\\:byIds`,
    summary: seedDocType.summary,
    requireApiKey: true,

    get: {
      operationName: `select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }ByIds`,
      summary: `Retrieve ${seedDocType.name} records using ids.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userHeader,
      ],
      requestQueryType: `${system}/select${
        capitalizeFirstLetter(seedDocType.pluralName)
      }ByIdsRequestQuery`,
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseBodyTypeArray: true,
      responseSuccessCode: 200,
    },
  };

  const docTypeFilterPaths: ServicePath[] = seedDocType.filters.map(
    (filter) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${filter.name}`,
      summary: filter.summary,
      requireApiKey: true,

      get: {
        operationName: `select${capitalizeFirstLetter(seedDocType.pluralName)}${
          capitalizeFirstLetter(filter.name)
        }`,
        summary: filter.summary,
        deprecation: filter.deprecation,
        tags: [seedDocType.pluralTitle],
        requestHeaders: [
          apiKeyHeader,
          ...partitionKeyHeaders,
          userHeader,
        ],
        requestQueryType: `${system}/select${
          capitalizeFirstLetter(seedDocType.pluralName)
        }${capitalizeFirstLetter(filter.name)}RequestQuery`,
        responseBodyType: `${system}/${seedDocType.name}Record`,
        responseBodyTypeArray: true,
        responseSuccessCode: 200,
      },
    }),
  );

  const docTypeCtorPaths: ServicePath[] = seedDocType.constructors.map(
    (ctor) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${ctor.name}`,
      summary: ctor.summary,
      requireApiKey: true,

      post: {
        operationName: `create${capitalizeFirstLetter(seedDocType.name)}${
          capitalizeFirstLetter(ctor.name)
        }`,
        summary: ctor.summary,
        deprecation: ctor.deprecation,
        tags: [seedDocType.pluralTitle],
        requestHeaders: [
          apiKeyHeader,
          ...partitionKeyHeaders,
          userHeader,
        ],
        requestQueryType: `${system}/create${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(ctor.name)}RequestQuery`,
        requestBodyType: `${system}/create${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(ctor.name)}RequestBody`,
        responseHeaders: [
          isNewHeader,
        ],
        responseBodyType: `${system}/${seedDocType.name}Record`,
        responseBodyTypeArray: true,
        responseSuccessCode: 201,
      },
    }),
  );

  const docTypeOpPaths: ServicePath[] = seedDocType.operations.map(
    (op) => ({
      relativeUrl:
        `/records/${seedDocType.pluralName}/{id:std/uuid}\\:${op.name}`,
      summary: op.summary,
      requireApiKey: true,

      post: {
        operationName: `operateOn${capitalizeFirstLetter(seedDocType.name)}${
          capitalizeFirstLetter(op.name)
        }`,
        summary: op.summary,
        deprecation: op.deprecation,
        tags: [seedDocType.pluralTitle],
        requestHeaders: [
          apiKeyHeader,
          ...partitionKeyHeaders,
          userHeader,
          reqVersionHeader,
          operationIdHeader,
        ],
        requestQueryType: `${system}/operateOn${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(op.name)}RequestQuery`,
        requestBodyType: `${system}/operateOn${
          capitalizeFirstLetter(seedDocType.name)
        }${capitalizeFirstLetter(op.name)}RequestBody`,
        responseHeaders: [
          isUpdatedHeader,
        ],
        responseBodyType: `${system}/${seedDocType.name}Record`,
        responseSuccessCode: 200,
      },
    }),
  );

  const docTypeQueryPaths: ServicePath[] = seedDocType.queries.map(
    (query) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${query.name}`,
      summary: query.summary,
      requireApiKey: true,

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
        responseBodyType: query.resultType,
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
