import { OpenApiSpec, OpenApiSpecPathOperation } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateOperations(openApi: OpenApiSpec) {
  const lines: string[] = [];

  const paths = Object.keys(openApi.paths);

  for (const path of paths) {
    const pathNode = openApi.paths[path];

    if (pathNode.delete) {
      lines.push(...generateOperation(pathNode.delete));
    }

    if (pathNode.get) {
      lines.push(...generateOperation(pathNode.get));
    }

    if (pathNode.patch) {
      lines.push(...generateOperation(pathNode.patch));
    }

    if (pathNode.post) {
      lines.push(...generateOperation(pathNode.post));
    }

    if (pathNode.put) {
      lines.push(...generateOperation(pathNode.put));
    }
  }

  return lines.join("\n");
}

function generateOperation(op: OpenApiSpecPathOperation) {
  const lines: string[] = [];

  const propsType = capitalizeFirstLetter(op.operationId) + "Props";

  lines.push(`export interface ${propsType} {`);
  lines.push(`  url: ${capitalizeFirstLetter(op.operationId)}UrlProps`);
  lines.push(`  headers?: Record<string, string>`);

  const hasRefBody = typeof op.requestBody === "object" &&
    typeof op.requestBody.$ref === "string" &&
    op.requestBody.$ref.startsWith("#/components/requestBodies/");

  const bodyType = hasRefBody
    ? op.requestBody?.$ref.replace("#/components/requestBodies/", "") as string
    : "";

  if (bodyType) {
    lines.push(`  body: ${bodyType}`);
  }

  lines.push("}\n");

  const urlFunc = op.operationId + "Url";
  const methodFunc = op.operationId + "Method";

  lines.push(`export async function ${op.operationId} (props: ${propsType}) {`);
  lines.push(
    `  const response = await fetch(${urlFunc}(props.url), {`,
  );
  lines.push(`    method: ${methodFunc}(),`);
  lines.push(`    headers: props.headers || {},`);

  if (bodyType) {
    lines.push(`    body: stringify${bodyType}(props.body)`);
  }

  lines.push(`  })\n`);

  // Check for 503/429 so we can throw RetryableErrors.
  // Otherwise throw 4XX client error, 5XX server error, or allow NetworkError to propogate.
  lines.push(`  if (!response.ok) {`);
  lines.push(
    `    throw new Error("Request rejected: " + await response.text())`,
  );
  lines.push("  }");

  const hasResult = op.responses["2XX"] &&
    typeof op.responses["2XX"].$ref === "string" &&
    !op.responses["2XX"].$ref.endsWith("/schemas/Empty");

  if (hasResult) {
    const lastSepIndex = op.responses["2XX"].$ref.lastIndexOf("/");
    const resultType = op.responses["2XX"].$ref.slice(lastSepIndex + 1);

    lines.push(`  const result = await response.json();`);
    lines.push(`  return result as ${resultType}`);
  }

  lines.push(`}\n`);

  return lines;
}
