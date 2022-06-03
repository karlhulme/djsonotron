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
  };

  return [
    docTypeRootPath,
  ];
}