import { RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

/**
 * Generates jsonotron types that define the payload of requests and responses
 * required to select and mutate the given seedDocType.
 * @param system The name of the system to which the signatures will be assigned.
 * @param seedDocType A seed docType for which signatures are required.
 * @param userType The name of the type that represents a user.
 */
export function generateSengiServiceSignatures(
  system: string,
  seedDocType: SengiSeedDocType,
  userType: string,
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
      {
        name: "partition",
        summary:
          "The name of the partition that holds the records to retrieve, otherwise the central partition is used.",
        propertyType: "std/shortString",
      },
      {
        name: "user",
        summary:
          "A JSON-stringified and url-encoded object that defines the user making the request.",
        propertyType: `${system}/${userType}`,
        isRequired: true,
      },
    ],
  };

  const selectSingularResponse: RecordTypeDef = {
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
      {
        name: "partition",
        summary:
          "The name of the partition that holds the records to retrieve, otherwise the central partition is used.",
        propertyType: "std/shortString",
      },
      {
        name: "user",
        summary:
          "A JSON-stringified and url-encoded object that defines the user making the request.",
        propertyType: `${system}/${userType}`,
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
      {
        name: "partition",
        summary:
          "The name of the partition that holds the records to retrieve, otherwise the central partition is used.",
        propertyType: "std/shortString",
      },
      {
        name: "user",
        summary:
          "A JSON-stringified and url-encoded object that defines the user making the request.",
        propertyType: `${system}/${userType}`,
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
        {
          name: "filterParams",
          summary:
            "A JSON-stringified and url-encoded object that provides the parameters required for the filter.",
          propertyType: filter.parametersType,
          isRequired: true,
        },
        {
          name: "partition",
          summary:
            "The name of the partition that holds the records to retrieve, otherwise the central partition is used.",
          propertyType: "std/shortString",
        },
        {
          name: "user",
          summary:
            "A JSON-stringified and url-encoded object that defines the user making the request.",
          propertyType: `${system}/${userType}`,
          isRequired: true,
        },
      ],
    }),
  );

  const selectPluralResponse: RecordTypeDef = {
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
      {
        name: "partition",
        summary:
          "The name of the partition where the new document should be stored.",
        propertyType: "std/shortString",
      },
      {
        name: "user",
        summary: "The user that is creating the new record.",
        propertyType: `${system}/${userType}`,
        isRequired: true,
      },
    ],
  };

  const newRequestResponse: RecordTypeDef = {
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
        name: "partition",
        summary:
          "The name of the partition where the new document should be stored.",
        propertyType: "std/shortString",
      },
      {
        name: "patch",
        summary: "The patch to be applied.",
        propertyType: `${system}/${seedDocType.name}Patch`,
        isRequired: true,
      },
      {
        name: "user",
        summary: "The user that is creating the new record.",
        propertyType: `${system}/${userType}`,
        isRequired: true,
      },
    ],
  };

  const patchRequestResponse: RecordTypeDef = {
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
      {
        name: "partition",
        summary:
          "The name of the partition where the new document should be stored.",
        propertyType: "std/shortString",
      },
      {
        name: "user",
        summary: "The user that is creating the new record.",
        propertyType: `${system}/${userType}`,
        isRequired: true,
      },
    ],
  };

  const replaceRequestResponse: RecordTypeDef = {
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

  const deleteRequestBody: RecordTypeDef = {
    kind: "record",
    system: system,
    name: `delete${capitalizeFirstLetter(seedDocType.name)}RequestBody`,
    summary:
      `The body parameters for deleting a ${seedDocType.name} record.`,
    properties: [
      {
        name: "partition",
        summary:
          "The name of the partition where the new document should be stored.",
        propertyType: "std/shortString",
      },
      {
        name: "user",
        summary: "The user that is creating the new record.",
        propertyType: `${system}/${userType}`,
        isRequired: true,
      },
    ],
  };

  const deleteRequestResponse: RecordTypeDef = {
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

  return [
    selectRequestQuery,
    selectSingularResponse,

    selectAllRequestQuery,
    selectByIdsRequestQuery,
    ...selectByFilterRequestQueries,
    selectPluralResponse,

    newRequestBody,
    newRequestResponse,

    patchRequestBody,
    patchRequestResponse,

    replaceRequestBody,
    replaceRequestResponse,

    deleteRequestBody,
    deleteRequestResponse
  ];
}
