import { JsonotronTypeDef } from '../interfaces/index.ts'
import { getSystemFromTypeString } from './getSystemFromTypeString.ts'
import { getTypeFromTypeString } from './getTypeFromTypeString.ts'

export function resolveJsonotronType (type: string, types: JsonotronTypeDef[]) {
  const typeSystem = getSystemFromTypeString(type);
  const typeName = getTypeFromTypeString(type);

  return types.find((t) =>
    t.system === typeSystem && t.name === typeName
  ) || null;
}
