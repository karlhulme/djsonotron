import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

/**
 * Returns the code for a function that generates the operation
 * bodies that connects an HTTP interface to Sengi.
 * @param seedDocTypes An array of seed doc types.
 */
export function generateSengiStandardOperationsCode(
  seedDocTypes: SengiSeedDocType[],
) {
  const ops: string[] = [];

  for (const seedDocType of seedDocTypes) {
    // The SelectAll adapter.
    ops.push(`
      selectAll${
      capitalizeFirstLetter(seedDocType.pluralName)
    }: async (props: SelectAll${
      capitalizeFirstLetter(seedDocType.pluralName)
    }Props): Promise<SelectAll${
      capitalizeFirstLetter(seedDocType.pluralName)
    }Result> => {
        const result = await sengi.selectDocuments({
          apiKey: ensureApiKeyHeaderValue(props.getHeader("x-api-key")),
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.query.fieldNames.split(","),
          partition: props.query.partition || options.defaultPartition,
          reqProps: {},
          user: props.query.user,
        });

        return {
          headers: [],
          body: {
            docs: result.docs as unknown as Svc${
      capitalizeFirstLetter(seedDocType.name)
    }Record[],
          },
        };
      }
    `);

    // The SelectByFilters adapter
    for (const filter of seedDocType.filters) {
      // The New adapter.
      ops.push(`
        select${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(filter.name)
      }: async (props: Select${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(filter.name)
      }Props): Promise<Select${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(filter.name)
      }Result> => {
        const result = await sengi.selectDocumentsByFilter({
          apiKey: ensureApiKeyHeaderValue(props.getHeader("x-api-key")),
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.query.fieldNames.split(","),
          filterName: "${filter.name}",
          filterParams: props.query.filterParams,
          partition: props.query.partition || options.defaultPartition,
          reqProps: {},
          user: props.query.user,
        });

        return {
          headers: [],
          body: {
            docs: result.docs as unknown as Svc${
        capitalizeFirstLetter(seedDocType.name)
      }Record[],
          },
        };
      }`);
    }

    // The New adapter.
    ops.push(`
     new${capitalizeFirstLetter(seedDocType.name)}: async (props: New${
      capitalizeFirstLetter(seedDocType.name)
    }Props): Promise<New${capitalizeFirstLetter(seedDocType.name)}Result> => {
       const result = await sengi.newDocument({
         apiKey: ensureApiKeyHeaderValue(props.getHeader("x-api-key")),
         docStoreOptions: {},
         docTypeName: "${seedDocType.name}",
         fieldNames: props.body.fieldNames || ["id"],
         id: props.body.id,
         doc: props.body.doc as unknown as DocRecord,
         partition: props.body.partition || options.defaultPartition,
         reqProps: {},
         user: props.body.user,
       });

       return {
         headers: [],
         body: {
           doc: result.doc as unknown as Svc${
      capitalizeFirstLetter(seedDocType.name)
    }Record,
           isNew: result.isNew,
         },
       };
     }
   `);
  }

  return `
    export function createSengiStandardOperations (sengi: Sengi<any, any, any, any, any>, options: CreateSengiStandardOperationsOptions) {
      return {
        ${ops.join(", ")}
      }
    }
`;
}
