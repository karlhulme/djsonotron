import { capitalizeFirstLetter } from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

/**
 * Returns the code for a function that generates the operation
 * bodies that connects an HTTP interface to Sengi.
 * @param seedDocTypes An array of seed doc types.
 */
export function generateSengiAdapterOperationsCode(
  seedDocTypes: SengiSeedDocType[],
) {
  const ops: string[] = [];

  for (const seedDocType of seedDocTypes) {
    // The Select adapter.
    ops.push(`
      select${capitalizeFirstLetter(seedDocType.name)}: async (props: Select${
      capitalizeFirstLetter(seedDocType.name)
    }Props): Promise<Select${
      capitalizeFirstLetter(seedDocType.name)
    }Result> => {
        const result = await sengi.selectDocumentsByIds({
          apiKey: ensureApiKeyHeaderValue(props.getHeader("x-api-key")),
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.query.fieldNames.split(","),
          ids: [props.id],
          partition: props.query.partition || options.defaultPartition,
          reqProps: {},
          user: props.query.user,
        });

        if (result.docs.length === 0) {
          throw new ServiceDocNotFoundError()
        }

        return {
          headers: [],
          body: {
            doc: result.docs[0] as unknown as Svc${
      capitalizeFirstLetter(seedDocType.name)
    }Record,
          },
        };
      }
    `);

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

    // The SelectByIds adapter.
    ops.push(`
      select${
      capitalizeFirstLetter(seedDocType.pluralName)
    }ByIds: async (props: Select${
      capitalizeFirstLetter(seedDocType.pluralName)
    }ByIdsProps): Promise<Select${
      capitalizeFirstLetter(seedDocType.pluralName)
    }ByIdsResult> => {
        const result = await sengi.selectDocumentsByIds({
          apiKey: ensureApiKeyHeaderValue(props.getHeader("x-api-key")),
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.query.fieldNames.split(","),
          ids: props.query.ids.split(","),
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

    // The Patch adapter.
    ops.push(`
    patch${capitalizeFirstLetter(seedDocType.name)}: async (props: Patch${
      capitalizeFirstLetter(seedDocType.name)
    }Props): Promise<Patch${capitalizeFirstLetter(seedDocType.name)}Result> => {
      const result = await sengi.patchDocument({
        apiKey: ensureApiKeyHeaderValue(props.getHeader("x-api-key")),
        docStoreOptions: {},
        docTypeName: "${seedDocType.name}",
        fieldNames: props.body.fieldNames || ["id"],
        id: props.id,
        operationId: props.getHeader("x-request-id") || crypto.randomUUID(),
        partition: props.body.partition || options.defaultPartition,
        patch: props.body.patch as unknown as DocPatch,
        reqProps: {},
        user: props.body.user,
      });

      return {
        headers: [],
        body: {
          doc: result.doc as unknown as Svc${
      capitalizeFirstLetter(seedDocType.name)
    }Record,
          isUpdated: result.isUpdated,
        },
      };
    }
  `);

    // The Replace adapter.
    ops.push(`
      replace${capitalizeFirstLetter(seedDocType.name)}: async (props: Replace${
      capitalizeFirstLetter(seedDocType.name)
    }Props): Promise<Replace${
      capitalizeFirstLetter(seedDocType.name)
    }Result> => {
        const result = await sengi.replaceDocument({
          apiKey: ensureApiKeyHeaderValue(props.getHeader("x-api-key")),
          doc: props.body.doc as unknown as DocRecord,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.body.fieldNames || ["id"],
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
    /**
     * Returns an object with a key for each standard operation
     * that connects to the given sengi instance.
     * @param sengi A sengi instance
     * @param options A property bag that describes
     */ 
    export function createSengiAdapterOperations (sengi: Sengi<any, any, any, any, any>, options: CreateSengiAdapterOperationsOptions) {
      return {
        ${ops.join(", ")}
      }
    }
`;
}
