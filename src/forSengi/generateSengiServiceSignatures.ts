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
        name: "partition",
        summary:
          "The name of the partition that holds the records to retrieve, otherwise the central partition is used.",
        propertyType: "std/shortString",
      },
      {
        name: "fieldNames",
        summary:
          "A comma-separated list of field names to be included on each record in the response.",
        propertyType: "std/mediumString",
        isRequired: true,
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

  const selectResponse: RecordTypeDef = {
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

  return [
    selectAllRequestQuery,
    selectResponse,
  ];
}
