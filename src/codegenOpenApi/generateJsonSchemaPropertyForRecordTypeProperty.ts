import {
  JsonotronTypeDef,
  RecordTypeDefProperty,
} from "../interfaces/index.ts";
import { getJsonotronTypeFormalName } from "../utils/index.ts";
import { generateDescriptionText } from "./generateDescriptionText.ts";

export function generateJsonSchemaPropertyForRecordTypeProperty(
  recordTypeDefProp: RecordTypeDefProperty,
  type: JsonotronTypeDef,
) {
  const commonProps = {
    title: type.summary,
    description: generateDescriptionText(
      recordTypeDefProp.summary,
      recordTypeDefProp.deprecated,
    ),
    deprecated: recordTypeDefProp.deprecated
      ? recordTypeDefProp.deprecated
      : undefined,
  };

  if (type.kind === "bool") {
    return {
      type: "boolean",
      ...commonProps,
    };
  } else if (type.kind === "enum" || type.kind === "record") {
    return {
      $ref: `#/components/schemas/${getJsonotronTypeFormalName(type)}`,
      ...commonProps,
    };
  } else if (type.kind === "float" || type.kind === "int") {
    return {
      type: "number",
      ...commonProps,
    };
  } else if (type.kind === "string") {
    return {
      type: "string",
      ...commonProps,
    };
  } else {
    return {};
  }
}
