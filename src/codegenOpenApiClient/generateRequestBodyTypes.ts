import { OpenApiSpec } from "../interfaces/index.ts";

export function generateRequestBodyTypes(openApi: OpenApiSpec) {
  const lines: string[] = [];

  const requestBodyKeys = Object.keys(openApi.components.requestBodies);

  for (const requestBodyKey of requestBodyKeys) {
    // deno-lint-ignore no-explicit-any
    const requestBody = openApi.components.requestBodies[requestBodyKey] as any;

    const isRequestBodyWithRef = typeof requestBody === "object" &&
      typeof requestBody.content === "object" &&
      typeof requestBody.content["application/json"] === "object" &&
      typeof requestBody.content["application/json"].schema === "object" &&
      typeof requestBody.content["application/json"].schema.$ref === "string";

    if (isRequestBodyWithRef) {
      const requestBodyRef =
        requestBody.content["application/json"].schema.$ref;
      const lastSepIndex = requestBodyRef.lastIndexOf("/");
      const requestBodyRefName = requestBodyRef.slice(lastSepIndex + 1);

      lines.push(`export type ${requestBodyKey} = ${requestBodyRefName}\n`);

      lines.push(
        `export function stringify${requestBodyKey} (value: ${requestBodyKey}) {`,
      );

      lines.push(`  return JSON.stringify(value);`);

      lines.push("}\n");
    }
  }

  return lines.join("\n");
}
