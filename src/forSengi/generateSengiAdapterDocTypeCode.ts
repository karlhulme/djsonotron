import { SengiSeedDocType } from "./SengiSeedDocType.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

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

  for (const seedDocType of seedDocTypes) {
    for (const filter of seedDocType.filters) {
      interfaceProps.push(
        `${seedDocType.name}${capitalizeFirstLetter(filter.name)}FilterParse: (
          props: DocTypeFilterParseProps<User, ${
          capitalizeFirstLetter(system)
        }${capitalizeFirstLetter(filter.name)}}Filter>
        ) => Filter;`,
      );
    }

    interfaceProps.push(
      `${seedDocType.name}Definition?: Partial<DocType<${system}${seedDocType.name}, DocStoreOptions, User, Filter, Query>>;`,
    );
  }

  return `
    interface CreateDocTypesOptions<DocStoreOptions, User, Filter, Query> {
      ${interfaceProps.join("\n")}
    }
  `;
}
