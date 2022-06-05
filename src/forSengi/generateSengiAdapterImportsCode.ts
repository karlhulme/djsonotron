import { SengiSeedDocType } from "./SengiSeedDocType.ts";
import {
  capitalizeFirstLetter,
  generateTypescriptImportLine,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

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
  const importsFromDeps: string[] = [
    "DocTypeConstructorImplProps",
    "DocTypeFilterParseProps",
    "DocPatch",
    "DocRecord",
    "DocType",
    "Sengi",
  ];

  const importsFromTypesAutogen: string[] = [
    "ValidationError",
  ];

  for (const sdt of props.seedDocTypes) {
    // The native doc type
    importsFromTypesAutogen.push(
      `${capitalizeFirstLetter(props.system)}${
        capitalizeFirstLetter(sdt.name)
      }`,
    );

    // The native doc type validator
    importsFromTypesAutogen.push(
      `validate${capitalizeFirstLetter(props.system)}${
        capitalizeFirstLetter(sdt.name)
      }`,
    );

    // The ___Record variant of the doc type
    importsFromTypesAutogen.push(
      `${capitalizeFirstLetter(props.system)}${
        capitalizeFirstLetter(sdt.name)
      }Record`,
    );

    for (const ctor of sdt.constructors) {
      // The parameters to a constructor
      importsFromTypesAutogen.push(
        `${
          capitalizeFirstLetter(getSystemFromTypeString(ctor.parametersType))
        }${capitalizeFirstLetter(getTypeFromTypeString(ctor.parametersType))}`,
      );

      // The validators used on parameters to a constructor
      importsFromTypesAutogen.push(
        `validate${
          capitalizeFirstLetter(getSystemFromTypeString(ctor.parametersType))
        }${capitalizeFirstLetter(getTypeFromTypeString(ctor.parametersType))}`,
      );
    }

    for (const filter of sdt.filters) {
      // The parameters to a filter
      importsFromTypesAutogen.push(
        `${capitalizeFirstLetter(props.system)}${
          capitalizeFirstLetter(getTypeFromTypeString(filter.name))
        }Filter`,
      );

      // The validator used on parameters to a filter
      importsFromTypesAutogen.push(
        `validate${capitalizeFirstLetter(props.system)}${
          capitalizeFirstLetter(getTypeFromTypeString(filter.name))
        }Filter`,
      );
    }

    for (const query of sdt.queries) {
      // The types used as a response to any query
      importsFromTypesAutogen.push(
        `${capitalizeFirstLetter(getSystemFromTypeString(query.resultType))}${
          capitalizeFirstLetter(getTypeFromTypeString(query.resultType))
        }`,
      );
    }
  }

  const importsFromServiceAutogen = props.seedDocTypes
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

      ...(sdt.constructors.map((ctor) =>
        `Create${capitalizeFirstLetter(sdt.name)}${
          capitalizeFirstLetter(ctor.name)
        }Props`
      )),
      ...(sdt.constructors.map((ctor) =>
        `Create${capitalizeFirstLetter(sdt.name)}${
          capitalizeFirstLetter(ctor.name)
        }Result`
      )),

      `Patch${capitalizeFirstLetter(sdt.name)}Props`,
      `Patch${capitalizeFirstLetter(sdt.name)}Result`,

      ...(sdt.operations.map((op) =>
        `OperateOn${capitalizeFirstLetter(sdt.name)}${
          capitalizeFirstLetter(op.name)
        }Props`
      )),
      ...(sdt.operations.map((op) =>
        `OperateOn${capitalizeFirstLetter(sdt.name)}${
          capitalizeFirstLetter(op.name)
        }Result`
      )),

      `Replace${capitalizeFirstLetter(sdt.name)}Props`,
      `Replace${capitalizeFirstLetter(sdt.name)}Result`,

      `Delete${capitalizeFirstLetter(sdt.name)}Props`,
      `Delete${capitalizeFirstLetter(sdt.name)}Result`,

      ...(sdt.queries.map((query) =>
        `Query${capitalizeFirstLetter(sdt.pluralName)}${
          capitalizeFirstLetter(query.name)
        }Props`
      )),
      ...(sdt.queries.map((query) =>
        `Query${capitalizeFirstLetter(sdt.pluralName)}${
          capitalizeFirstLetter(query.name)
        }Result`
      )),
    ])
    .flat();

  return `
    // deno-lint-ignore-file no-explicit-any
    ${
    generateTypescriptImportLine(
      importsFromDeps,
      props.depsPath,
    )
  }
    ${
    generateTypescriptImportLine(
      importsFromTypesAutogen,
      props.typesPath,
    )
  }
    ${
    generateTypescriptImportLine(
      importsFromServiceAutogen,
      props.servicesPath,
    )
  }
  `;
}
