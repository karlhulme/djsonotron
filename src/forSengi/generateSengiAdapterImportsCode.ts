import { SengiSeedDocType } from "./SengiSeedDocType.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

interface GenerateSengiAdapterImportsCodeProps {
  system: string;
  seedDocTypes: SengiSeedDocType[];
  typesPath: string;
  servicesPath: string;
  depsPath: string;
}

export function generateSengiAdapterImportsCode(
  props: GenerateSengiAdapterImportsCodeProps,
) {
  const importSeedDocTypeInputOutputTypes = props.seedDocTypes
    .map((sdt) => [
      `${capitalizeFirstLetter(props.system)}${
        capitalizeFirstLetter(sdt.name)
      }Record`,
    ])
    .flat()
    .join(", ");

  const importServiceInputOutputTypes = props.seedDocTypes
    .map((sdt) => [
      `Select${capitalizeFirstLetter(sdt.name)}Props`,
      `Select${capitalizeFirstLetter(sdt.name)}Result`,

      `SelectAll${capitalizeFirstLetter(sdt.pluralName)}Props`,
      `SelectAll${capitalizeFirstLetter(sdt.pluralName)}Result`,

      `Select${capitalizeFirstLetter(sdt.pluralName)}ByIdsProps`,
      `Select${capitalizeFirstLetter(sdt.pluralName)}ByIdsResult`,

      ...(sdt.filters.map((filter) =>
        `Select${capitalizeFirstLetter(sdt.pluralName)}${
          capitalizeFirstLetter(filter.name)
        }Props`
      )),
      ...(sdt.filters.map((filter) =>
        `Select${capitalizeFirstLetter(sdt.pluralName)}${
          capitalizeFirstLetter(filter.name)
        }Result`
      )),

      `New${capitalizeFirstLetter(sdt.name)}Props`,
      `New${capitalizeFirstLetter(sdt.name)}Result`,

      // parameterised constructors

      `Patch${capitalizeFirstLetter(sdt.name)}Props`,
      `Patch${capitalizeFirstLetter(sdt.name)}Result`,

      // operations

      `Replace${capitalizeFirstLetter(sdt.name)}Props`,
      `Replace${capitalizeFirstLetter(sdt.name)}Result`,

      `Delete${capitalizeFirstLetter(sdt.name)}Props`,
      `Delete${capitalizeFirstLetter(sdt.name)}Result`,
      // queries
    ])
    .flat()
    .join(", ");

  return `
    // deno-lint-ignore-file no-explicit-any
    import { DocPatch, DocRecord, Sengi } from "${props.depsPath}"
    import { ${importSeedDocTypeInputOutputTypes} } from "${props.typesPath}"
    import { ${importServiceInputOutputTypes} } from "${props.servicesPath}"
  `;
}
