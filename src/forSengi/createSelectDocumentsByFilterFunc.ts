import { capitalizeFirstLetter } from "../utils/index.ts";

/**
 * Returns an selectDocumentsByFilter function definition.
 * @param system The name of the Jsonotron system to which
 * the type belongs.  This is typically 'db'.
 * @param name The name of the document collection.
 * @param pluralName The plural name of the document collection.
 * @param useSinglePartition True if the documents are stored
 * in a single partition, or false if a partition will need
 * to be supplied when using this document collection.
 */
export function createSelectDocumentsByFilterFunc(
  system: string,
  name: string,
  pluralName: string,
  useSinglePartition: boolean,
) {
  return {
    name: `select${capitalizeFirstLetter(system)}${
      capitalizeFirstLetter(pluralName)
    }ByFilter`,
    params: [{
      name: "props",
      typeName: `{ filter: CosmosDbDocStoreFilter, ${
        useSinglePartition ? "" : "partition: string,"
      } includeArchived?: boolean }`,
    }],
    outputGeneration: 2,
    exported: true,
    lines: `return sengi.selectDocumentsByFilter<${
      capitalizeFirstLetter(system)
    }${capitalizeFirstLetter(name)}>({
        docTypeName: '${name}',
        filter: props.filter,
        ${
      useSinglePartition ? "partition: null," : "partition: props.partition,"
    }
        includeArchived: props.includeArchived
      })`,
  };
}