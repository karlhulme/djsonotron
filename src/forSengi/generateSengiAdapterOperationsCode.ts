import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";
import { SengiSeedDocType } from "./SengiSeedDocType.ts";

/**
 * Returns the code for a function that generates the operation
 * bodies that connects an HTTP interface to Sengi.
 * @param system The system that houses the seed doc type variants.
 * @param seedDocTypes An array of seed doc types.
 */
export function generateSengiAdapterOperationsCode(
  system: string,
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
          apiKey: props.apiKey,
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
          body: {
            doc: result.docs[0] as unknown as ${capitalizeFirstLetter(system)}${
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
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.query.fieldNames.split(","),
          partition: props.query.partition || options.defaultPartition,
          reqProps: {},
          user: props.query.user,
        });

        return {
          body: {
            docs: result.docs as unknown as ${capitalizeFirstLetter(system)}${
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
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.query.fieldNames.split(","),
          ids: props.query.ids.split(","),
          partition: props.query.partition || options.defaultPartition,
          reqProps: {},
          user: props.query.user,
        });

        return {
          body: {
            docs: result.docs as unknown as ${capitalizeFirstLetter(system)}${
      capitalizeFirstLetter(seedDocType.name)
    }Record[],
          },
        };
      }
    `);

    // The SelectByFilters adapters
    for (const filter of seedDocType.filters) {
      ops.push(`
        select${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(filter.name)
      }: async (props: Select${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(filter.name)
      }Props): Promise<Select${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(filter.name)
      }Result> => {
        const result = await sengi.selectDocumentsByFilter({
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.query.fieldNames.split(","),
          filterName: "${filter.name}",
          filterParams: {
            ${
        filter.parameters.map((p) => `
              ${p.name}: props.query.${p.name}
            `)
      }
          },
          partition: props.query.partition || options.defaultPartition,
          reqProps: {},
          user: props.query.user,
        });

        return {
          body: {
            docs: result.docs as unknown as ${capitalizeFirstLetter(system)}${
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
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.body.fieldNames || ["id"],
          doc: props.body.doc as unknown as DocRecord,
          partition: props.body.partition || options.defaultPartition,
          reqProps: {},
          user: props.body.user,
        });

        return {
          body: {
            doc: result.doc as unknown as ${capitalizeFirstLetter(system)}${
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
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.body.fieldNames || ["id"],
          id: props.id,
          operationId: props.body.operationId || crypto.randomUUID(),
          partition: props.body.partition || options.defaultPartition,
          patch: props.body.patch as unknown as DocPatch,
          reqProps: {},
          user: props.body.user,
        });

        return {
          body: {
            doc: result.doc as unknown as ${capitalizeFirstLetter(system)}${
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
        if (props.id !== props.body.doc.id) {
          throw new ServiceDocIdMismatchError()
        }

        const result = await sengi.replaceDocument({
          apiKey: props.apiKey,
          doc: props.body.doc as unknown as DocRecord,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.body.fieldNames || ["id"],
          partition: props.body.partition || options.defaultPartition,
          reqProps: {},
          user: props.body.user,
        });
  
        return {
          body: {
            doc: result.doc as unknown as ${capitalizeFirstLetter(system)}${
      capitalizeFirstLetter(seedDocType.name)
    }Record,
            isNew: result.isNew,
          },
        };
      }
    `);

    // The Delete adapter.
    ops.push(`
      delete${capitalizeFirstLetter(seedDocType.name)}: async (props: Delete${
      capitalizeFirstLetter(seedDocType.name)
    }Props): Promise<Delete${
      capitalizeFirstLetter(seedDocType.name)
    }Result> => {
        const result = await sengi.deleteDocument({
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          id: props.id,
          partition: props.body.partition || options.defaultPartition,
          reqProps: {},
          user: props.body.user,
        });
  
        return {
          body: {
            isDeleted: result.isDeleted,
          },
        };
      }
    `);

    // The Create adapters
    for (const ctor of seedDocType.constructors) {
      ops.push(`
        create${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(ctor.name)
      }: async (props: Create${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(ctor.name)
      }Props): Promise<Create${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(ctor.name)
      }Result> => {
        const result = await sengi.createDocument({
          apiKey: props.apiKey,
          constructorName: "${ctor.name}",
          constructorParams: props.body.constructorParams,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.body.fieldNames.split(","),
          id: props.body.id,
          partition: props.body.partition || options.defaultPartition,
          reqProps: {},
          user: props.body.user,
        });

        return {
          body: {
            doc: result.doc as unknown as ${capitalizeFirstLetter(system)}${
        capitalizeFirstLetter(seedDocType.name)
      }Record,
            isNew: result.isNew
          },
        };
      }`);
    }

    // The Operation adapters
    for (const op of seedDocType.operations) {
      ops.push(`
        operateOn${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(op.name)
      }: async (props: OperateOn${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(op.name)
      }Props): Promise<OperateOn${capitalizeFirstLetter(seedDocType.name)}${
        capitalizeFirstLetter(op.name)
      }Result> => {
        const result = await sengi.operateOnDocument({
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          fieldNames: props.body.fieldNames.split(","),
          id: props.body.id,
          operationId: props.body.operationId,
          operationName: "${op.name}",
          operationParams: props.body.operationParams,
          partition: props.body.partition || options.defaultPartition,
          reqProps: {},
          user: props.body.user,
          reqVersion: props.body.reqVersion
        });

        return {
          body: {
            doc: result.doc as unknown as ${capitalizeFirstLetter(system)}${
        capitalizeFirstLetter(seedDocType.name)
      }Record,
            isUpdated: result.isUpdated
          },
        };
      }`);
    }

    // The Queries adapters
    for (const query of seedDocType.queries) {
      ops.push(`
        query${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(query.name)
      }: async (props: Query${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(query.name)
      }Props): Promise<Query${capitalizeFirstLetter(seedDocType.pluralName)}${
        capitalizeFirstLetter(query.name)
      }Result> => {
        const result = await sengi.queryDocuments({
          apiKey: props.apiKey,
          docStoreOptions: {},
          docTypeName: "${seedDocType.name}",
          queryName: "${query.name}",
          queryParams: {
            ${
        query.parameters.map((p) => `
              ${p.name}: props.query.${p.name}
            `)
      }
          },
          reqProps: {},
          user: props.query.user,
        });

        return {
          body: {
            data: result.data as ${
        capitalizeFirstLetter(getSystemFromTypeString(query.resultType))
      }${capitalizeFirstLetter(getTypeFromTypeString(query.resultType))}
          },
        };
      }`);
    }
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
