import { RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

/**
 * Generates jsonotron types that define the payload of requests and responses
 * required to select and mutate the given seedDocType.
 * @param system The name of the system to which the signatures will be assigned.
 * @param seedDocType A seed docType for which signatures are required.
 */
export function generateSengiServiceSignatureRecords(
  system: string,
  seedDocType: SengiSeedDocType,
) {
  const selectRequestQuery: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `select${capitalizeFirstLetter(seedDocType.name)}RequestQuery`,
    summary:
      `The query parameters for requesting a ${seedDocType.name} record.`,
    properties: [
      {
        name: "fieldNames",
        summary:
          "A comma-separated list of field names to be included on each record in the response.",
        propertyType: "std/mediumString",
        isRequired: true,
      },
    ],
  };

  const selectSingularResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `select${capitalizeFirstLetter(seedDocType.name)}Response`,
    summary: `A response that contains a ${seedDocType.name} record.`,
    properties: [
      {
        name: "doc",
        summary: `A ${seedDocType.name} record.`,
        propertyType: `${system}/${seedDocType.name}Record`,
        isRequired: true,
      },
    ],
  };

  const selectAllRequestQuery: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `selectAll${
      capitalizeFirstLetter(seedDocType.pluralName)
    }RequestQuery`,
    summary:
      `The query parameters for requesting all ${seedDocType.name} records.`,
    properties: [
      {
        name: "fieldNames",
        summary:
          "A comma-separated list of field names to be included on each record in the response.",
        propertyType: "std/mediumString",
        isRequired: true,
      },
    ],
  };

  const selectByIdsRequestQuery: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `select${
      capitalizeFirstLetter(seedDocType.pluralName)
    }ByIdsRequestQuery`,
    summary:
      `The query parameters for requesting ${seedDocType.name} records by ids.`,
    properties: [
      {
        name: "fieldNames",
        summary:
          "A comma-separated list of field names to be included on each record in the response.",
        propertyType: "std/longString",
        isRequired: true,
      },
      {
        name: "ids",
        summary:
          "A comma-separated list of ids that determine which records are included in the response.",
        propertyType: "std/longString",
        isRequired: true,
      },
    ],
  };

  const selectByFilterRequestQueries: RecordTypeDef[] = seedDocType.filters.map(
    (filter) => ({
      kind: "record",
      system: system,
      name: `select${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(filter.name)
      }RequestQuery`,
      summary:
        `The query parameters for requesting ${seedDocType.name} records using the ${filter.name} filter.`,
      properties: [
        {
          name: "fieldNames",
          summary:
            "A comma-separated list of field names to be included on each record in the response.",
          propertyType: "std/longString",
          isRequired: true,
        },
        ...filter.parameters.map((filterParam) => ({
          name: filterParam.name,
          summary: filterParam.summary,
          propertyType: filterParam.propertyType,
          isRequired: filterParam.isRequired,
          deprecated: filterParam.deprecated,
        })),
      ],
    }),
  );

  const selectPluralResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `select${capitalizeFirstLetter(seedDocType.pluralName)}Response`,
    summary: `A response that contains selected ${seedDocType.name} records.`,
    properties: [
      {
        name: "docs",
        summary: `A collection of ${seedDocType.name} records.`,
        propertyType: `${system}/${seedDocType.name}Record`,
        isRequired: true,
        isArray: true,
      },
    ],
  };

  const newRequestBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `new${capitalizeFirstLetter(seedDocType.name)}RequestBody`,
    summary:
      `The body parameters for creating a new ${seedDocType.name} record.`,
    properties: [
      {
        name: "doc",
        summary: "The contents for the new document.",
        propertyType: `${system}/new${
          capitalizeFirstLetter(seedDocType.name)
        }Template`,
        isRequired: true,
      },
      {
        name: "fieldNames",
        summary: "An array of field names to be included on the response.",
        propertyType: "std/mediumString",
        isArray: true,
      },
    ],
  };

  const newResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `new${capitalizeFirstLetter(seedDocType.name)}Response`,
    summary: `A response that contains the new record.`,
    properties: [
      {
        name: "doc",
        summary: "The newly created record.",
        propertyType: `${system}/${seedDocType.name}Record`,
        isRequired: true,
      },
      {
        name: "isNew",
        summary:
          "True if a document was created, or false if the document already existed.",
        propertyType: "std/bool",
        isRequired: true,
      },
    ],
  };

  const patchRequestBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `patch${capitalizeFirstLetter(seedDocType.name)}RequestBody`,
    summary: `The body parameters for patching a ${seedDocType.name} record.`,
    properties: [
      {
        name: "fieldNames",
        summary: "An array of field names to be included on the response.",
        propertyType: "std/mediumString",
        isArray: true,
      },
      {
        name: "operationId",
        summary:
          "The id for the operation.  This operation will only be applied once.",
        propertyType: "std/uuid",
      },
      {
        name: "patch",
        summary: "The patch to be applied.",
        propertyType: `${system}/${seedDocType.name}Patch`,
        isRequired: true,
      },
    ],
  };

  const patchResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `patch${capitalizeFirstLetter(seedDocType.name)}Response`,
    summary: `A response that contains the patched record.`,
    properties: [
      {
        name: "doc",
        summary: "The updated record.",
        propertyType: `${system}/${seedDocType.name}Record`,
        isRequired: true,
      },
      {
        name: "isUpdated",
        summary:
          "True if a document was updated, or false if the patch had already been applied.",
        propertyType: "std/bool",
        isRequired: true,
      },
    ],
  };

  const replaceRequestBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `replace${capitalizeFirstLetter(seedDocType.name)}RequestBody`,
    summary:
      `The body parameters for creating a new ${seedDocType.name} record.`,
    properties: [
      {
        name: "doc",
        summary:
          "The replacement doc that includes values for the system fields.",
        propertyType: `${system}/${seedDocType.name}Replacement`,
        isRequired: true,
      },
      {
        name: "fieldNames",
        summary: "An array of field names to be included on the response.",
        propertyType: "std/mediumString",
        isArray: true,
      },
    ],
  };

  const replaceResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `replace${capitalizeFirstLetter(seedDocType.name)}Response`,
    summary: `A response that contains the replaced record.`,
    properties: [
      {
        name: "doc",
        summary: "The newly replaced record.",
        propertyType: `${system}/${seedDocType.name}Record`,
        isRequired: true,
      },
      {
        name: "isNew",
        summary:
          "True if a new document was created, or false if an existing document was replaced.",
        propertyType: "std/bool",
        isRequired: true,
      },
    ],
  };

  const deleteResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `delete${capitalizeFirstLetter(seedDocType.name)}Response`,
    summary: `A response that indicates if a record was deleted.`,
    properties: [
      {
        name: "isDeleted",
        summary:
          "True if a document was deleted, or false if a document was not deleted.",
        propertyType: "std/bool",
        isRequired: true,
      },
    ],
  };

  const createRequestBodies: RecordTypeDef[] = seedDocType.constructors.map(
    (ctor) => ({
      kind: "record",
      system: system,
      name: `create${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(ctor.name)
      }RequestBody`,
      summary:
        `The parameters for creating a new ${seedDocType.name} record using the ${ctor.name} constructor.`,
      properties: [
        {
          name: "fieldNames",
          summary:
            "A comma-separated list of field names to be included on each record in the response.",
          propertyType: "std/longString",
          isRequired: true,
        },
        {
          name: "id",
          summary: "The id to be assigned to the newly created document.",
          propertyType: "std/uuid",
          isRequired: true,
        },
        {
          name: "constructorParams",
          summary: "The constructor parameters.",
          propertyType: ctor.parametersType,
          isRequired: true,
        },
      ],
    }),
  );

  const createResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `create${capitalizeFirstLetter(seedDocType.name)}Response`,
    summary: `A response that contains the created record.`,
    properties: [
      {
        name: "doc",
        summary: "The newly created record.",
        propertyType: `${system}/${seedDocType.name}Record`,
        isRequired: true,
      },
      {
        name: "isNew",
        summary:
          "True if a document was created, or false if the document already existed.",
        propertyType: "std/bool",
        isRequired: true,
      },
    ],
  };

  const operationRequestBodies: RecordTypeDef[] = seedDocType.operations.map(
    (op) => ({
      kind: "record",
      system: system,
      name: `operateOn${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(op.name)
      }RequestBody`,
      summary:
        `The parameters for operating on the ${seedDocType.name} record using the ${op.name} operation.`,
      properties: [
        {
          name: "fieldNames",
          summary:
            "A comma-separated list of field names to be included on each record in the response.",
          propertyType: "std/longString",
          isRequired: true,
        },
        {
          name: "id",
          summary: "The id to be assigned to the newly created document.",
          propertyType: "std/uuid",
          isRequired: true,
        },
        {
          name: "operationId",
          summary: "The id of the operation.",
          propertyType: "std/uuid",
          isRequired: true,
        },
        {
          name: "operationParams",
          summary: "The parameters of the operation.",
          propertyType: op.parametersType,
          isRequired: true,
        },
      ],
    }),
  );

  const operationResponseBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `operateOn${capitalizeFirstLetter(seedDocType.name)}Response`,
    summary: `A response that contains the mutated record.`,
    properties: [
      {
        name: "doc",
        summary: "The recently mutated record.",
        propertyType: `${system}/${seedDocType.name}Record`,
        isRequired: true,
      },
      {
        name: "isUpdated",
        summary:
          "True if the document was updated, or false if the document was not updated.",
        propertyType: "std/bool",
        isRequired: true,
      },
    ],
  };

  const queryRequestQueries: RecordTypeDef[] = seedDocType.queries.map(
    (query) => ({
      kind: "record",
      system: system,
      name: `query${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(query.name)
      }RequestQuery`,
      summary:
        `The parameters for querying ${seedDocType.name} records using the ${query.name} query.`,
      properties: [
        ...query.parameters.map((queryParam) => ({
          name: queryParam.name,
          summary: queryParam.summary,
          propertyType: queryParam.propertyType,
          isRequired: queryParam.isRequired,
          deprecated: queryParam.deprecated,
        })),
      ],
    }),
  );

  const queryResponseBodies: RecordTypeDef[] = seedDocType.queries.map(
    (query) => ({
      kind: "record",
      system: system,
      name: `query${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(query.name)
      }Response`,
      summary: `A response that contains the result of executing the query.`,
      properties: [
        {
          name: "data",
          summary: "The result of executing the query.",
          propertyType: query.resultType,
          isRequired: true,
        },
      ],
    }),
  );

  return [
    selectRequestQuery,
    selectSingularResponseBody,

    selectAllRequestQuery,
    selectByIdsRequestQuery,
    ...selectByFilterRequestQueries,
    selectPluralResponseBody,

    newRequestBody,
    newResponseBody,

    patchRequestBody,
    patchResponseBody,

    replaceRequestBody,
    replaceResponseBody,

    deleteResponseBody,

    ...createRequestBodies,
    createResponseBody,

    ...operationRequestBodies,
    operationResponseBody,

    ...queryRequestQueries,
    ...queryResponseBodies,
  ];
}
