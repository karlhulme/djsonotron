import { ServicePathParameter } from "../interfaces/index.ts";

export function getServicePathParameters(path: string) {
  const params: ServicePathParameter[] = [];

  for (const pathMatch of path.matchAll(/{[^:{}]+:[^:{}]+}/g)) {
    // Remove the outer braces and split based on the colon.
    const pathMatchElements = pathMatch[0]
      .slice(1, pathMatch[0].length - 1)
      .split(":", 2);

    params.push({
      name: pathMatchElements[0],
      type: pathMatchElements[1],
    });
  }

  return params;
}
