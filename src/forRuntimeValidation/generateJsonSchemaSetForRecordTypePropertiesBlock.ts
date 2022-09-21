import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
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
      if (recordProp.isArray) {
        objectProperties[recordProp.name] = {
          type: "array",
          description: generateJsonSchemaDescriptionText(
            recordProp.summary,
            recordProp.deprecated,
          ),
          deprecated: Boolean(recordProp.deprecated),
          items: {
            $ref: `${componentSchemasPath}${recordPropType.system}${
              capitalizeFirstLetter(recordPropType.name)
            }`,
          },
        };
      } else {
        objectProperties[recordProp.name] =
          generateJsonSchemaForRecordTypeProperty(
            recordProp.summary,
            recordProp.deprecated,
            recordPropType,
            Boolean(recordProp.isNullable),
            componentSchemasPath,
          );
      }
    }
  }

  return objectProperties;
}

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
 * @param componentSchemasPath The path to the component schemas,
 * defaults to #/components/schemas which is the path found in OpenApi
 * specifications.
 */
function generateJsonSchemaForRecordTypeProperty(
  summary: string,
  deprecated: string | undefined,
  jsonotronTypeDef: JsonotronTypeDef,
  isNullable: boolean,
  componentSchemasPath: string,
) {
  const documentationProps = {
    title: jsonotronTypeDef.summary,
    description: generateJsonSchemaDescriptionText(
      summary,
      deprecated,
    ),
    deprecated: Boolean(deprecated),
  };

  const nullableProps = isNullable
    ? {
      nullable: true,
    }
    : {};

  return {
    $ref: `${componentSchemasPath}${jsonotronTypeDef.system}${
      capitalizeFirstLetter(jsonotronTypeDef.name)
    }
    }`,
    ...nullableProps,
    ...documentationProps,
  };
}
