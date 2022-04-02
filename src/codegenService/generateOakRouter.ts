import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOakRouterOperationInputOutputTypes } from "./generateOakRouterOperationInputOutputTypes.ts";
import { generateOakRouterConstructorProps } from "./generateOakRouterConstructorProps.ts";
import { generateOakRouterConstructor } from "./generateOakRouterConstructor.ts";

export function generateOakRouter(service: Service, types: JsonotronTypeDef[]) {
  const declarations: string[] = [];

  declarations.push(...generateOakRouterConstructorProps(service));

  declarations.push(...generateOakRouterConstructor(service, types));

  declarations.push(...generateOakRouterOperationInputOutputTypes(service, types));

  return declarations.join("\n\n");
}
