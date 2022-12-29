import { capitalizeFirstLetter } from "../utils/index.ts";

/**
 * Returns a newDocument function definition.
 * @param system The name of the Jsonotron system to which
 * the type belongs.  This is typically 'db'.
 * @param name The name of the document collection.
 * @param useSinglePartition True if the documents are stored
 * in a single partition, or false if a partition will need
 * to be supplied when using this document collection.
 */
export function createNewDocumentFunc(
  system: string,
  name: string,
  useSinglePartition: boolean,
) {
  return {
    name: `new${capitalizeFirstLetter(system)}${capitalizeFirstLetter(name)}`,
    params: [{
      name: "props",
      typeName: `{ doc: Partial<Omit<${capitalizeFirstLetter(system)}${
        capitalizeFirstLetter(name)
      }, OmittedNewDocumentFieldNames>>, operationId?: string|null, userId?: string|null, explicitId?: string, reqVersion?: string, sequenceNo?: string, ${
        useSinglePartition ? "" : "partition: string,"
      }}`,
    }],
    outputGeneration: 2,
    exported: true,
    lines: `return sengi.newDocument<${capitalizeFirstLetter(system)}${
      capitalizeFirstLetter(name)
    }>({
        docTypeName: '${name}',
        doc: props.doc,
        operationId: props.operationId || crypto.randomUUID(),
        userId: props.userId || SYSTEM_USER_ID,
        explicitId: props.explicitId,
        reqVersion: props.reqVersion,
        sequenceNo: props.sequenceNo,
        ${
      useSinglePartition ? "partition: null," : "partition: props.partition,"
    }
      })`,
  };
}
