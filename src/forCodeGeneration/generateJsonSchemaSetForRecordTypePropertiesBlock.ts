import {
  JsonotronTypeDef,
  RecordTypeDef,
  RecordTypeDefProperty,
} from "../interfaces/index.ts";
import { capitalizeFirstLetter, resolveJsonotronType } from "../utils/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";

/**
 * Generates a record where each key is a record property and the
 * corresponding value is a json schema that validates said property.
 * @param recordType A record type.
 * @param types An array of jsonotron types that the record might
 * reference in the property declarations.
 * @param componentSchemasPath The path to the component schemas,
 * defaults to #/components/schemas which is the path found in OpenApi
 * specifications.
 */
export function generateJsonSchemaSetForRecordTypePropertiesBlock(
  recordType: RecordTypeDef<string>,
  types: JsonotronTypeDef[],
  componentSchemasPath: string,
) {
  const objectProperties: Record<string, unknown> = {};

  for (const recordProp of recordType.properties) {
    const recordPropType = resolveJsonotronType(recordProp.propertyType, types);

    if (recordPropType) {
      objectProperties[recordProp.name] =
        generateJsonSchemaForRecordTypeProperty(
          recordProp,
          recordPropType,
          componentSchemasPath,
        );
    }
  }

  return objectProperties;
}

/**
 * Generates a JSON schema that either directly describes a simple
 * JSON type (e.g. string, number) or generates a reference to a
 * complex type that is expected to be found in the
 * #/components/schemas section.
 * @param recordProp A property on a jsonotron record.
 * @param recordPropType The Jsonotron type of the record.
 * @param componentSchemasPath The path to the component schemas,
 * defaults to #/components/schemas which is the path found in OpenApi
 * specifications.
 */
function generateJsonSchemaForRecordTypeProperty(
  recordProp: RecordTypeDefProperty<string>,
  recordPropType: JsonotronTypeDef,
  componentSchemasPath: string,
) {
  const documentationProps = {
    description: generateJsonSchemaDescriptionText(
      recordProp.summary,
      recordProp.deprecated || null,
      recordPropType.summary,
      recordProp.isArray || false,
    ),
    deprecated: Boolean(recordProp.deprecated),
  };

  const nullableProps = recordProp.isNullable
    ? {
      nullable: true,
    }
    : {};

  return {
    $ref: `${componentSchemasPath}${recordPropType.system}${
      capitalizeFirstLetter(recordPropType.name)
    }${recordProp.isArray ? "Array" : ""}`,
    ...nullableProps,
    ...documentationProps,
  };
}
