import { Service, ServicePathOperation } from "../interfaces/index.ts";
import {
  capitalizeFirstLetter,
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";

// split these into multiple files.
// still need generateImports (where I can tell it where to find _deps and types.autogen)
// still need the big createRouter function that contains the validation code

export function generateOakRouter(service: Service) {
  const declarations: string[] = [];

  declarations.push(...generateRouterConstructorProps(service));

  declarations.push(...generateOperationInputOutputTypes(service));

  return declarations.join("\n\n");
}

export function generateOperationInputOutputTypes(service: Service) {
  const declarations: string[] = [];

  for (const path of service.paths) {
    if (path.delete) {
      declarations.push(...generateOperationInputType(path.delete));
      declarations.push(...generateOperationOutputType(path.delete));
    }

    if (path.get) {
      declarations.push(...generateOperationInputType(path.get));
      declarations.push(...generateOperationOutputType(path.get));
    }

    if (path.patch) {
      declarations.push(...generateOperationInputType(path.patch));
      declarations.push(...generateOperationOutputType(path.patch));
    }

    if (path.post) {
      declarations.push(...generateOperationInputType(path.post));
      declarations.push(...generateOperationOutputType(path.post));
    }

    if (path.put) {
      declarations.push(...generateOperationInputType(path.put));
      declarations.push(...generateOperationOutputType(path.put));
    }
  }

  return declarations;
}

export function generateOperationInputType(op: ServicePathOperation) {
  const declarations: string[] = [];

  const reqQuerySystem = op.requestQueryType
    ? getSystemFromTypeString(op.requestQueryType)
    : null;

  const reqQueryType = op.requestQueryType
    ? getTypeFromTypeString(op.requestQueryType)
    : null;

  const reqBodySystem = op.requestBodyType
    ? getSystemFromTypeString(op.requestBodyType)
    : null;

  const reqBodyType = op.requestBodyType
    ? getTypeFromTypeString(op.requestBodyType)
    : null;

  const propsInterface = `
  export interface ${capitalizeFirstLetter(op.operationName)}Props {
    ${
    reqQuerySystem && reqQueryType
      ? `query: ${capitalizeFirstLetter(reqQuerySystem)}${
        capitalizeFirstLetter(reqQueryType)
      }`
      : ""
  }
    ${
    reqBodySystem && reqBodyType
      ? `body: ${capitalizeFirstLetter(reqBodySystem)}${
        capitalizeFirstLetter(reqBodyType)
      }`
      : ""
  }
    getHeader: (name: string) => string|null
    getCookie: (name: string) => Promise<string|undefined>
  } 
  `;

  declarations.push(propsInterface);

  return declarations;
}

export function generateOperationOutputType(op: ServicePathOperation) {
  const declarations: string[] = [];

  const resBodySystem = op.responseBodyType
    ? getSystemFromTypeString(op.responseBodyType)
    : null;

  const resBodyType = op.responseBodyType
    ? getTypeFromTypeString(op.responseBodyType)
    : null;

  const resultInterface = `
  export interface ${capitalizeFirstLetter(op.operationName)}Result {
    ${
    resBodySystem && resBodyType
      ? `body: ${capitalizeFirstLetter(resBodySystem)}${
        capitalizeFirstLetter(resBodyType)
      }`
      : ""
  }
    headers: HeaderNameValue[]
  }
  `;

  declarations.push(resultInterface);

  return declarations;
}

export function generateRouterConstructorProps(service: Service) {
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

  const resultInterface = `
  export interface CreateRouterProps {
    ${interfaceLines.join("\n")}
  }
  `;

  declarations.push(resultInterface);

  return declarations;
}
