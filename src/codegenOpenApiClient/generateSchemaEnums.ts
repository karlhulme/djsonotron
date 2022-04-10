import { OpenApiSpec } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateSchemaEnums(openApi: OpenApiSpec) {
  const lines: string[] = [];

  const schemaKeys = Object.keys(openApi.components.schemas);

  for (const schemaKey of schemaKeys) {
    // deno-lint-ignore no-explicit-any
    const schema = openApi.components.schemas[schemaKey] as any;

    if (schema.type === "string" && Array.isArray(schema.enum)) {
      const enumValues = (schema.enum as string[])
        .map((v) => `'${v}'`)
        .join(", ");

      const enumName = capitalizeFirstLetter(schemaKey);
      const enumValuesName = enumName + "Values";

      lines.push(`export const ${enumValuesName} = [
        ${enumValues}
        ] as const`);

      lines.push(
        `export type ${enumName} = typeof ${enumValuesName}[keyof typeof ${enumValuesName}]`,
      );
    }
  }

  return lines.join("\n\n");
}
