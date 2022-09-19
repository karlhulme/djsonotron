/**
 * Returns a stringified version of a runtime that can be passed
 * to a Typescript tree for output.
 * @param runtimeType A runtime type.
 */
export function stringifyJRuntimeType(
  runtimeType: {
    name: string;
    underlyingType: string;
    validator: string;
    schema: unknown;
  },
) {
  return `{
    name: "${runtimeType.name}",
    underlyingType: "${runtimeType.underlyingType}",
    validator: ${runtimeType.validator},
    schema: ${JSON.stringify(runtimeType.schema)}
  }`;
}
