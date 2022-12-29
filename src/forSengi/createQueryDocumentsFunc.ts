import { capitalizeFirstLetter } from "../utils/index.ts";

/**
 * Returns a queryDocuments function definition.
 * @param system The name of the Jsonotron system to which
 * the type belongs.  This is typically 'db'.
 * @param name The name of the document collection.
 * @param pluralName The plural name of the document collection.
 */
export function createQueryDocumentsFunc(
  system: string,
  name: string,
  pluralName: string,
) {
  return {
    name: `query${capitalizeFirstLetter(system)}${
      capitalizeFirstLetter(pluralName)
    }`,
    typeParams: ["QueryResult"],
    params: [{
      name: "props",
      typeName:
        `{ query: CosmosDbDocStoreQuery, coerceResult: (queryRawResult: unknown) => QueryResult }`,
    }],
    outputGeneration: 2,
    exported: true,
    lines: `return sengi.queryDocuments<QueryResult>({
        docTypeName: '${name}',
        query: props.query,
        coerceResult: props.coerceResult
      })`,
  };
}
