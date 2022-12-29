import { capitalizeFirstLetter } from "../utils/index.ts";

/**
 * Returns a deleteDocument function definition.
 * @param system The name of the Jsonotron system to which
 * the type belongs.  This is typically 'db'.
 * @param name The name of the document collection.
 * @param useSinglePartition True if the documents are stored
 * in a single partition, or false if a partition will need
 * to be supplied when using this document collection.
 */
export function createDeleteDocumentFunc(
  system: string,
  name: string,
  useSinglePartition: boolean,
) {
  return {
    name: `delete${capitalizeFirstLetter(system)}${
      capitalizeFirstLetter(name)
    }`,
    params: [{
      name: "props",
      typeName:
        `{ id: string, operationId?: string|null, userId?: string|null, ${
          useSinglePartition ? "" : "partition: string,"
        }}`,
    }],
    outputGeneration: 2,
    exported: true,
    lines: `return sengi.deleteDocument<${capitalizeFirstLetter(system)}${
      capitalizeFirstLetter(name)
    }>({
        docTypeName: '${name}',
        id: props.id,
        operationId: props.operationId || crypto.randomUUID(),
        userId: props.userId || SYSTEM_USER_ID,
        ${
      useSinglePartition ? "partition: null," : "partition: props.partition,"
    }
      })`,
  };
}
