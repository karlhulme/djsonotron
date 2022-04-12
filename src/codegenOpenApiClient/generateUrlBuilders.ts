import {
  OpenApiSpec,
  OpenApiSpecPath,
  OpenApiSpecPathOperation,
} from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateUrlBuilders(openApi: OpenApiSpec) {
  const lines: string[] = [];

  const paths = Object.keys(openApi.paths);

  for (const path of paths) {
    const pathNode = openApi.paths[path];

    if (pathNode.delete) {
      lines.push(...generateUrlBuilder(path, pathNode, pathNode.delete));
    }

    if (pathNode.get) {
      lines.push(...generateUrlBuilder(path, pathNode, pathNode.get));
    }

    if (pathNode.patch) {
      lines.push(...generateUrlBuilder(path, pathNode, pathNode.patch));
    }

    if (pathNode.post) {
      lines.push(...generateUrlBuilder(path, pathNode, pathNode.post));
    }

    if (pathNode.put) {
      lines.push(...generateUrlBuilder(path, pathNode, pathNode.put));
    }
  }

  return lines.join("\n");
}

function generateUrlBuilder(
  path: string,
  pathNode: OpenApiSpecPath,
  op: OpenApiSpecPathOperation,
) {
  const lines: string[] = [];

  const capitalizedOpId = capitalizeFirstLetter(op.operationId);

  const openApiParams = op.parameters
    .concat(pathNode.parameters)
    .filter((p) => p.in === "query" || p.in === "path");

  lines.push(`export interface ${capitalizedOpId}UrlProps {`);
  lines.push("  host: string");

  for (const param of openApiParams) {
    const reqSymbol = param.required ? "" : "?";
    lines.push(`  ${param.name}${reqSymbol}: string`);
  }

  lines.push(`}\n`);

  lines.push(
    `export function ${op.operationId}Url (props: ${capitalizedOpId}UrlProps) {`,
  );

  let urlBuilder = "${props.host}";

  const urlSegments = path.split("/").filter((s) => s);

  for (const urlSegment of urlSegments) {
    const isParam = urlSegment.startsWith("{");

    if (isParam) {
      urlBuilder += "/${props." + urlSegment.slice(1, urlSegment.length - 1) +
        "}";
    } else {
      urlBuilder += "/" + urlSegment;
    }
  }

  lines.push(`  const queryParams: string[] = [];`);

  for (const queryParam of op.parameters) {
    if (!queryParam.required) {
      lines.push(`  if (props.${queryParam.name}) {`);
    }
    lines.push(
      `    queryParams.push(\`${queryParam.name}=\${props.${queryParam.name}}\`);`,
    );
    if (!queryParam.required) {
      lines.push(`  }`);
    }
  }

  lines.push(`  const querySep = queryParams.length > 0 ? "?" : ""`);

  lines.push(`  return \`${urlBuilder}\${querySep}\${queryParams.join("&")}\``);
  lines.push("}\n");

  return lines;
}
