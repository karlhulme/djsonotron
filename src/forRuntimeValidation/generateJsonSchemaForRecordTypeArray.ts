import { TypescriptTreeConstDeclaration } from "../../deps.ts";
import { JsonotronTypeDef, RecordTypeDef } from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateJsonSchemaDescriptionText } from "./generateJsonSchemaDescriptionText.ts";
import { generateJsonSchemaSetForRecordTypePropertiesBlock } from "./generateJsonSchemaSetForRecordTypePropertiesBlock.ts";

/**
 * Returns a JSON array schema for the record type.
 * @param recordType A Jsonotron record type.
 * @param types An array of Jsonotron types that might be referenced
 * by the properties of the given record type def.
 * @param componentSchemasPath The path to the component schemas.
 */
export function generateJsonSchemaForRecordTypeArray(
  recordType: RecordTypeDef<string>,
  types: JsonotronTypeDef[],
  componentSchemasPath?: string,
): TypescriptTreeConstDeclaration {
  const objectProperties = generateJsonSchemaSetForRecordTypePropertiesBlock(
    recordType,
    types,
    componentSchemasPath,
  );

  // OpenApi expects the required property of JSON schemas to have at least
  // one element, otherwise it should be omitted.
  const requiredPropertyNames = recordType.properties
    .filter((p) => p.isRequired)
    .map((p) => p.name);

  return {
    name: `${recordType.system}${
      capitalizeFirstLetter(recordType.name)
    }ArraySchema`,
    comment:
      `The JSON schema for an array of ${recordType.system}/${recordType.name} types.`,
    exported: true,
    deprecated: Boolean(recordType.deprecated),
    value: "`" + JSON.stringify({
      type: "array",
      description: generateJsonSchemaDescriptionText(
        `An array of ${recordType.system}/${recordType.name} types.`,
        recordType.deprecated,
      ),
      items: {
        type: "object",
        properties: objectProperties,
        required: requiredPropertyNames.length > 0
          ? requiredPropertyNames
          : undefined,
      },
    }) + "`",
  };
}
