import { SengiSeedDocType } from "./SengiSeedDocType.ts";
import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

/**
 * Returns typescript code that creates an array of sengi doc types
 * from the seeds while allowing the custom implementations of filters,
 * constructors, operations and queries to be plugged in.
 * @param system The system that the seed doc types are placed into.
 * @param seedDocTypes An array of seed doc types.
 */
export function generateSengiAdapterDocTypeCode(
  system: string,
  seedDocTypes: SengiSeedDocType[],
) {
  const interfaceProps: string[] = [];
  const docTypeDefs: string[] = [];

  for (const seedDocType of seedDocTypes) {
    for (const ctor of seedDocType.constructors) {
      interfaceProps.push(
        `${seedDocType.name}${
          capitalizeFirstLetter(ctor.name)
        }CtorImplementation: (
          props: DocTypeConstructorImplProps<User, ${
          capitalizeFirstLetter(getSystemFromTypeString(ctor.parametersType))
        }${capitalizeFirstLetter(getTypeFromTypeString(ctor.parametersType))}>
        ) => Omit<${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(seedDocType.name)
        }, "id" | "docType" | "docOpIds" | "docVersion" | "docCreatedByUserId" | "docCreatedMillisecondsSinceEpoch" | "docLastUpdatedByUserId" | "docLastUpdatedMillisecondsSinceEpoch">;`,
      );
    }

    for (const filter of seedDocType.filters) {
      interfaceProps.push(
        `${seedDocType.name}${capitalizeFirstLetter(filter.name)}FilterParse: (
          props: DocTypeFilterParseProps<User, ${
          capitalizeFirstLetter(system)
        }${capitalizeFirstLetter(filter.name)}Filter>
        ) => Filter;`,
      );
    }

    for (const op of seedDocType.operations) {
      interfaceProps.push(
        `${seedDocType.name}${capitalizeFirstLetter(op.name)}OpImplementation: (
          props: DocTypeOperationImplProps<${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(seedDocType.name)
        }, User, ${
          capitalizeFirstLetter(getSystemFromTypeString(op.parametersType))
        }${capitalizeFirstLetter(getTypeFromTypeString(op.parametersType))}>
        ) => void;
        ${seedDocType.name}${capitalizeFirstLetter(op.name)}OpAuthorise?: (
          props: DocTypeOperationAuthProps<${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(seedDocType.name)
        }, User, ${
          capitalizeFirstLetter(getSystemFromTypeString(op.parametersType))
        }${capitalizeFirstLetter(getTypeFromTypeString(op.parametersType))}>
        ) => string|undefined;`,
      );
    }

    for (const query of seedDocType.queries) {
      interfaceProps.push(
        `${seedDocType.name}${capitalizeFirstLetter(query.name)}QueryParse: (
          props: DocTypeQueryParseProps<User, ${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(query.name)
        }Query>
        ) => Query;
        ${seedDocType.name}${capitalizeFirstLetter(query.name)}QueryCoerce: (
          queryResult: unknown
        ) => ${
          capitalizeFirstLetter(getSystemFromTypeString(query.resultType))
        }${capitalizeFirstLetter(getTypeFromTypeString(query.resultType))};
        ${seedDocType.name}${
          capitalizeFirstLetter(query.name)
        }QueryAuthorise?: (
          props: DocTypeQueryAuthProps<${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(seedDocType.name)
        }, User, ${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(query.name)
        }Query>
        ) => string|undefined;
        `,
      );
    }

    interfaceProps.push(
      `${seedDocType.name}Definition?: Partial<DocType<${
        capitalizeFirstLetter(system)
      }${
        capitalizeFirstLetter(seedDocType.name)
      }, DocStoreOptions, User, Filter, Query>>;`,
    );

    docTypeDefs.push(
      `{
        ...options.${seedDocType.name}Definition,
        name: "${seedDocType.name}",
        pluralName: "${seedDocType.pluralName}",
        title: "${seedDocType.title}",
        pluralTitle: "${seedDocType.pluralTitle}",
        summary:"${seedDocType.summary}",
        validateDoc: v(validate${capitalizeFirstLetter(system)}${
        capitalizeFirstLetter(seedDocType.name)
      }),
        constructors: {
          ${
        seedDocType.constructors.map((ctor) => `
            ${ctor.name}: {
              implementation: options.${seedDocType.name}${
          capitalizeFirstLetter(ctor.name)
        }CtorImplementation,
              validateParameters: v(validate${
          capitalizeFirstLetter(getSystemFromTypeString(ctor.parametersType))
        }${capitalizeFirstLetter(getTypeFromTypeString(ctor.parametersType))}),
            }
          `).join("\n, ")
      }
        },
        filters: {
          ${
        seedDocType.filters.map((filter) => `
            ${filter.name}: {
              parse: options.${seedDocType.name}${
          capitalizeFirstLetter(filter.name)
        }FilterParse,
              validateParameters: v(validate${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(filter.name)
        }Filter),
            }
          `).join("\n, ")
      }
        },
        operations: {
          ${
        seedDocType.operations.map((op) => `
            ${op.name}: {
              implementation: options.${seedDocType.name}${
          capitalizeFirstLetter(op.name)
        }OpImplementation,
              validateParameters: v(validate${
          capitalizeFirstLetter(getSystemFromTypeString(op.parametersType))
        }${capitalizeFirstLetter(getTypeFromTypeString(op.parametersType))}),
              authorise: options.${seedDocType.name}${
          capitalizeFirstLetter(op.name)
        }OpAuthorise,
            }
          `).join("\n, ")
      }
        },
        queries: {
          ${
        seedDocType.queries.map((query) => `
            ${query.name}: {
              parse: options.${seedDocType.name}${
          capitalizeFirstLetter(query.name)
        }QueryParse,
              validateParameters: v(validate${capitalizeFirstLetter(system)}${
          capitalizeFirstLetter(query.name)
        }Query),
              coerce: options.${seedDocType.name}${
          capitalizeFirstLetter(query.name)
        }QueryCoerce,
              validateResponse: v(validate${
          capitalizeFirstLetter(getSystemFromTypeString(query.resultType))
        }${capitalizeFirstLetter(getTypeFromTypeString(query.resultType))}),
              authorise: options.${seedDocType.name}${
          capitalizeFirstLetter(query.name)
        }QueryAuthorise,
            }
          `).join("\n, ")
      }
        },
      }`,
    );
  }

  return `
    interface CreateDocTypesOptions<DocStoreOptions, User, Filter, Query> {
      ${interfaceProps.join("\n")}
    }

    export function createDocTypes<DocStoreOptions, User, Filter, Query>(
      options: CreateDocTypesOptions<DocStoreOptions, User, Filter, Query>,
    ): DocType<any, DocStoreOptions, User, Filter, Query>[] {
      return [
        ${docTypeDefs.join("\n")}
      ];
    }
  `;
}
