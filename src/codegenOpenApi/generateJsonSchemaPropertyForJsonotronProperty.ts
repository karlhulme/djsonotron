import { JsonotronTypeDef } from "../interfaces/index.ts";
import { getJsonotronTypeFormalName } from "../utils/index.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateJsonSchemaPropertyForJsonotronProperty(
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
  } else {
    return {};
  }
}
