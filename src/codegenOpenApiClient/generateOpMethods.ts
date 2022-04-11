import { OpenApiSpec, OpenApiSpecPathOperation } from "../interfaces/index.ts";

export function generateOpMethods(openApi: OpenApiSpec) {
  const lines: string[] = [];

  const paths = Object.keys(openApi.paths);

  for (const path of paths) {
    const pathNode = openApi.paths[path];

    if (pathNode.delete) {
      lines.push(...generateOpMethod("delete", pathNode.delete));
    }

    if (pathNode.get) {
      lines.push(...generateOpMethod("get", pathNode.get));
    }

    if (pathNode.patch) {
      lines.push(...generateOpMethod("patch", pathNode.patch));
    }

    if (pathNode.post) {
      lines.push(...generateOpMethod("post", pathNode.post));
    }

    if (pathNode.put) {
      lines.push(...generateOpMethod("put", pathNode.put));
    }
  }

  return lines.join("\n\n");
}

function generateOpMethod(method: string, op: OpenApiSpecPathOperation) {
  const lines: string[] = [];

  lines.push(`export function ${op.operationId}Method {`);
  lines.push(`  return "${method}";`);
  lines.push("}");

  return lines;
}
