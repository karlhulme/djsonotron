import {
  JsonotronTypeDef,
  RecordTypeDefProperty,
} from "../interfaces/index.ts";
import { getJsonotronTypeFormalName } from "../utils/index.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateJsonSchemaPropertyForRecordTypeProperty(
  recordProp: RecordTypeDefProperty,
  recordPropType: JsonotronTypeDef,
  includeDocumentationProps: boolean,
) {
  const documentationProps = includeDocumentationProps
    ? {
      title: recordPropType.summary,
      description: generateDescriptionText(
        recordProp.summary,
        recordProp.deprecated,
      ),
      deprecated: recordProp.deprecated ? true : undefined,
    }
    : {};

  if (recordPropType.kind === "bool") {
    return {
      type: "boolean",
      ...documentationProps,
    };
  } else if (
    recordPropType.kind === "enum" || recordPropType.kind === "record"
  ) {
    return {
      $ref: `#/components/schemas/${
        getJsonotronTypeFormalName(recordPropType)
      }`,
      ...documentationProps,
    };
  } else if (recordPropType.kind === "float" || recordPropType.kind === "int") {
    return {
      type: "number",
      ...documentationProps,
    };
  } else if (recordPropType.kind === "string") {
    return {
      type: "string",
      ...documentationProps,
    };
  } else {
    return {};
  }
}
