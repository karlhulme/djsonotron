import { Service } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateOakRouterConstructorProps(service: Service) {
  const declarations: string[] = [];

  const interfaceLines: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      interfaceLines.push(
        `${path.delete.operationName}: (props: ${
          capitalizeFirstLetter(path.delete.operationName)
        }Props) => Promise<${
          capitalizeFirstLetter(path.delete.operationName)
        }Result>`,
      );
    }

    if (path.get) {
      interfaceLines.push(
        `${path.get.operationName}: (props: ${
          capitalizeFirstLetter(path.get.operationName)
        }Props) => Promise<${
          capitalizeFirstLetter(path.get.operationName)
        }Result>`,
      );
    }

    if (path.patch) {
      interfaceLines.push(
        `${path.patch.operationName}: (props: ${
          capitalizeFirstLetter(path.patch.operationName)
        }Props) => Promise<${
          capitalizeFirstLetter(path.patch.operationName)
        }Result>`,
      );
    }

    if (path.post) {
      interfaceLines.push(
        `${path.post.operationName}: (props: ${
          capitalizeFirstLetter(path.post.operationName)
        }Props) => Promise<${
          capitalizeFirstLetter(path.post.operationName)
        }Result>`,
      );
    }

    if (path.put) {
      interfaceLines.push(
        `${path.put.operationName}: (props: ${
          capitalizeFirstLetter(path.put.operationName)
        }Props) => Promise<${
          capitalizeFirstLetter(path.put.operationName)
        }Result>`,
      );
    }
  }

  const operationFailedResult = `
  export interface OperationFailedResult {
    body: unknown;
    headers: HeaderNameValue[];
  }`;

  declarations.push(operationFailedResult);

  const resultInterface = `
  export interface CreateRouterProps {
    ${interfaceLines.join("\n")}
    handleError: (err: Error) => Promise<OperationFailedResult>
  }
  `;

  declarations.push(resultInterface);

  return declarations;
}
