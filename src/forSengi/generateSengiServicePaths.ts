import {
  ServicePath,
  ServicePathOperationHeader,
  ServicePathOperationQueryParam,
  ServicePathOperationResponseHeader,
} from "../interfaces/index.ts";
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
  const servicePaths: ServicePath[] = [];

  // query params

  const fieldNamesForSingularRecordParam: ServicePathOperationQueryParam = {
    name: "fieldNames",
    paramType: "std/hugeString",
    summary:
      `A comma-separated list of field names to be included on the returned record.
      If this field is omitted then just the id property will be returned.`,
  };

  const fieldNamesForPluralRecordsParam: ServicePathOperationQueryParam = {
    name: "fieldNames",
    paramType: "std/hugeString",
    summary:
      `A comma-separated list of field names to be included on each record
      in the response. If this field is omitted then just the id property of each record will be returned.`,
  };

  const idsParam: ServicePathOperationQueryParam = {
    name: "ids",
    paramType: "std/hugeString",
    summary:
      "A comma-separated list of ids that determine which records are included in the response.",
    isRequired: true,
  };

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

  const userIdHeader: ServicePathOperationHeader = {
    name: "userId",
    headerType: "std/mediumString",
    httpName: "x-user-id",
    summary: `An id of the user making the request.
      If this header is omitted then the anonymous user will be assumed.`,
    isRequired: false,
  };

  const userClaimsHeader: ServicePathOperationHeader = {
    name: "userClaims",
    headerType: "std/hugeString",
    httpName: "x-user-claims",
    summary:
      `A comma-separated list of the claims held by the user making the request.
      If this header is omitted then the user will be assumed to have no claims.`,
    isRequired: false,
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
      `A UUID for this operation which ensures repeat invocation will not change the underlying resource.`,
    isRequired: false,
  };

  const newDocIdHeader: ServicePathOperationHeader = {
    name: "newDocId",
    headerType: "std/uuid",
    httpName: "idempotency-key",
    summary: `A UUID to be assigned to the newly created document.`,
    isRequired: true,
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

  servicePaths.push({
    relativeUrl: `/records/${seedDocType.pluralName}`,
    summary: `A collection of ${seedDocType.name} resources.`,
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
        userIdHeader,
        userClaimsHeader,
      ],
      requestQueryParams: [
        fieldNamesForPluralRecordsParam,
      ],
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
        userIdHeader,
        userClaimsHeader,
      ],
      requestQueryParams: [
        fieldNamesForSingularRecordParam,
      ],
      requestBodyType: `${system}/${seedDocType.name}Template`,
      responseHeaders: [
        isNewHeader,
      ],
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseSuccessCode: 201,
    },
  });

  // document-based operations

  servicePaths.push({
    relativeUrl: `/records/${seedDocType.pluralName}/{id:std/uuid}`,
    summary: `A single ${seedDocType} resource.`,
    requireApiKey: true,

    delete: {
      operationName: `delete${capitalizeFirstLetter(seedDocType.name)}`,
      summary: `Delete a ${seedDocType.name} record.`,
      tags: [seedDocType.pluralTitle],
      requestHeaders: [
        apiKeyHeader,
        ...partitionKeyHeaders,
        userIdHeader,
        userClaimsHeader,
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
        userIdHeader,
        userClaimsHeader,
      ],
      requestQueryParams: [
        fieldNamesForSingularRecordParam,
      ],
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
        userIdHeader,
        userClaimsHeader,
        reqVersionHeader,
        operationIdHeader,
      ],
      requestQueryParams: [
        fieldNamesForSingularRecordParam,
      ],
      requestBodyType: `${system}/${seedDocType.name}Patch`,
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
        userIdHeader,
        userClaimsHeader,
      ],
      requestQueryParams: [
        fieldNamesForSingularRecordParam,
      ],
      requestBodyType: `${system}/${seedDocType.name}Replacement`,
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseSuccessCode: 200,
    },
  });

  // custom verb operations

  servicePaths.push({
    relativeUrl: `/records/${seedDocType.pluralName}\\:byIds`,
    summary: `The byIds verb on a collection of ${seedDocType.name} resources.`,
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
        userIdHeader,
        userClaimsHeader,
      ],
      requestQueryParams: [
        fieldNamesForPluralRecordsParam,
        idsParam,
      ],
      responseBodyType: `${system}/${seedDocType.name}Record`,
      responseBodyTypeArray: true,
      responseSuccessCode: 200,
    },
  });

  servicePaths.push(...seedDocType.filters.map(
    (filter) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${filter.name}`,
      summary:
        `The ${filter.name} verb on a collection of ${seedDocType.name} resources.`,
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
          userIdHeader,
          userClaimsHeader,
        ],
        requestQueryParams: [
          fieldNamesForPluralRecordsParam,
          ...filter.parameters.map((p) => ({
            name: p.name,
            paramType: p.propertyType,
            summary: p.summary,
            isRequired: p.isRequired,
            deprecation: p.deprecated,
          })),
        ],
        responseBodyType: `${system}/${seedDocType.name}Record`,
        responseBodyTypeArray: true,
        responseSuccessCode: 200,
      },
    }),
  ));

  servicePaths.push(...seedDocType.constructors.map(
    (ctor) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${ctor.name}`,
      summary:
        `The ${ctor.name} verb on a collection of ${seedDocType.name} resources.`,
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
          userIdHeader,
          userClaimsHeader,
          newDocIdHeader,
        ],
        requestQueryParams: [
          fieldNamesForSingularRecordParam,
        ],
        requestBodyType: ctor.parametersType,
        responseHeaders: [
          isNewHeader,
        ],
        responseBodyType: `${system}/${seedDocType.name}Record`,
        responseSuccessCode: 201,
      },
    }),
  ));

  servicePaths.push(...seedDocType.operations.map(
    (op) => ({
      relativeUrl:
        `/records/${seedDocType.pluralName}/{id:std/uuid}\\:${op.name}`,
      summary:
        `The ${op.name} verb on a collection of ${seedDocType.name} resources.`,
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
          userIdHeader,
          userClaimsHeader,
          reqVersionHeader,
          operationIdHeader,
        ],
        requestQueryParams: [
          fieldNamesForSingularRecordParam,
        ],
        requestBodyType: op.parametersType,
        responseHeaders: [
          isUpdatedHeader,
        ],
        responseBodyType: `${system}/${seedDocType.name}Record`,
        responseSuccessCode: 200,
      },
    }),
  ));

  servicePaths.push(...seedDocType.queries.map(
    (query) => ({
      relativeUrl: `/records/${seedDocType.pluralName}\\:${query.name}`,
      summary:
        `The ${query.name} verb on a collection of ${seedDocType.name} resources.`,
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
          userIdHeader,
          userClaimsHeader,
        ],
        requestQueryParams: query.parameters.map((p) => ({
          name: p.name,
          paramType: p.propertyType,
          summary: p.summary,
          isRequired: p.isRequired,
          deprecation: p.deprecated,
        })),
        responseBodyType: query.resultType,
        responseSuccessCode: 200,
      },
    }),
  ));

  return servicePaths;
}
