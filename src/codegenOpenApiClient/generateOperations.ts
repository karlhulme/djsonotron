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

  if (bodyType) {
    lines.push(`    body: stringify${bodyType}(props.body)`);
  }

  lines.push(`  })\n`);
  lines.push(`  const result = await response.json();`);

  // determine if there is an actual response type or if it's just empty.

  lines.push(`  return result as string`);
  lines.push(`}\n`);

  return lines;
}
