import {
  JsonotronTypeDef,
  ServicePath
} from '../interfaces/index.ts'
import { generateOakRouterOperation } from './generateOakRouterOperation.ts'

export function generateOakRouterPath(
  path: ServicePath,
  types: JsonotronTypeDef[],
) {
  const lines: string[] = [];

  if (path.delete) {
    lines.push(
      ...generateOakRouterOperation("delete", path, path.delete, types),
    );
  }

  if (path.get) {
    lines.push(
      ...generateOakRouterOperation("get", path, path.get, types),
    );
  }

  if (path.patch) {
    lines.push(
      ...generateOakRouterOperation("patch", path, path.patch, types),
    );
  }

  if (path.post) {
    lines.push(
      ...generateOakRouterOperation("post", path, path.post, types),
    );
  }

  if (path.put) {
    lines.push(
      ...generateOakRouterOperation("put", path, path.put, types),
    );
  }

  return lines;
}
