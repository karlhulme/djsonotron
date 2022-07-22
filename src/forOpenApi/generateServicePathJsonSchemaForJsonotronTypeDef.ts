import { JsonotronTypeDef } from "../interfaces/index.ts";
import { getJsonotronTypeFormalName } from "../utils/index.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

/**
 * Generates a JSON schema that either directly describes a simple
 * JSON type (e.g. string, number) or generates a reference to a
 * complex type that is expected to be found in the
 * #/components/schemas section.
 * @param summary The summary of the field.
 * @param deprecated If populated, this indicates the field is
 * no longer in use and what to use instead.
 * @param jsonotronTypeDef A jsonotron type definition.
 * @param isNullable True if the field can be null.
 * @param includeDocumentationProps True if the documentation properties
 * should be included.
 */
export function generateServicePathJsonSchemaForJsonotronTypeDef(
  summary: string,
  deprecated: string | undefined,
  jsonotronTypeDef: JsonotronTypeDef,
  isNullable: boolean,
  includeDocumentationProps: boolean,
) {
  const documentationProps = includeDocumentationProps
    ? {
      title: jsonotronTypeDef.summary,
      description: generateDescriptionText(
        summary,
        deprecated,
      ),
      deprecated: deprecated ? true : undefined,
    }
    : {};

  const nullableProps = isNullable
    ? {
      nullable: true,
    }
    : {};

  if (jsonotronTypeDef.kind === "bool") {
    return {
      type: "boolean",
      ...nullableProps,
      ...documentationProps,
    };
  } else if (
    jsonotronTypeDef.kind === "enum" || jsonotronTypeDef.kind === "record"
  ) {
    return {
      $ref: `#/components/schemas/${
        getJsonotronTypeFormalName(jsonotronTypeDef)
      }`,
      ...nullableProps,
      ...documentationProps,
    };
  } else if (
    jsonotronTypeDef.kind === "float" || jsonotronTypeDef.kind === "int"
  ) {
    return {
      type: "number",
      ...nullableProps,
      ...documentationProps,
    };
  } else if (jsonotronTypeDef.kind === "string") {
    return {
      type: "string",
      ...nullableProps,
      ...documentationProps,
    };
  } else if (jsonotronTypeDef.kind === "object") {
    return {
      type: "object",
      ...nullableProps,
      ...documentationProps,
    };
  } else {
    return {};
  }
}
