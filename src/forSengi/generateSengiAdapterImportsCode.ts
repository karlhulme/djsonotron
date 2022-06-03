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
  const importTypeNames = props.seedDocTypes
    .map((sdt) =>
      `${capitalizeFirstLetter(props.system)}${
        capitalizeFirstLetter(sdt.name)
      }Record`
    )
    .join(", ");

  const importServiceNames = props.seedDocTypes
    .map((sdt) => [
      `SelectAll${capitalizeFirstLetter(sdt.pluralName)}Props`,
      `SelectAll${capitalizeFirstLetter(sdt.pluralName)}Result`,
    ])
    .flat()
    .join(", ");

  return `
    // deno-lint-ignore-file no-explicit-any
    import { Sengi } from "${props.depsPath}"
    import { ${importTypeNames} } from "${props.typesPath}"
    import { ${importServiceNames} } from "${props.servicesPath}"
  `;
}
