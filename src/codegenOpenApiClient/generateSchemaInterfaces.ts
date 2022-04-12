import { OpenApiSpec } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";

export function generateSchemaInterfaces(openApi: OpenApiSpec) {
  const lines: string[] = [];

  const schemaKeys = Object.keys(openApi.components.schemas);

  for (const schemaKey of schemaKeys) {
    // deno-lint-ignore no-explicit-any
    const schema = openApi.components.schemas[schemaKey] as any;

    if (schema.type === "object" && typeof schema.properties === "object") {
      const typeName = capitalizeFirstLetter(schemaKey);

      lines.push(`export interface ${typeName} {`);

      const requiredFields = Array.isArray(schema.required)
        ? schema.required as string[]
        : [];

      const propertyNames = Object.keys(schema.properties);

      for (const propertyName of propertyNames) {
        const property = schema.properties[propertyName];

        const isRequired = requiredFields.includes(propertyName);

        const propertyType = typeof property.$ref === "string"
          ? (property.$ref as string).slice(
            (property.$ref as string).lastIndexOf("/") + 1,
          )
          : property.type;

        lines.push(
          `  ${propertyName}${isRequired ? "" : "?"}: ${propertyType}`,
        );
      }

      lines.push("}\n");

      lines.push(
        `export function queryParam${typeName} (value: ${typeName}) {`,
      );

      lines.push(`  return encodeURIComponent(JSON.stringify(value));`);

      lines.push("}\n");
    }
  }

  return lines.join("\n");
}
