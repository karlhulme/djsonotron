import {
  EnumTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
} from "../interfaces/index.ts";
import {
  getJsonotronTypeFormalName
} from '../utils/index.ts';
import { generateJsonSchemaForEnumType } from "./generateJsonSchemaForEnumType.ts";
import { generateJsonSchemaForRecordType } from "./generateJsonSchemaForRecordType.ts";

export function generateJsonSchemasForJsonotronTypes(
  types: JsonotronTypeDef[],
): Record<string, unknown> {
  const schemas: Record<string, unknown> = {};

  const enumTypes = types.filter((t) => t.kind === "enum");

  for (const enumType of enumTypes) {
    const enumTypeFormalName = getJsonotronTypeFormalName(enumType);

    schemas[enumTypeFormalName] = generateJsonSchemaForEnumType(
      enumType as EnumTypeDef,
    );
  }

  const recordTypes = types.filter((t) => t.kind === "record");

  for (const recordType of recordTypes) {
    const recordTypeFormalName = getJsonotronTypeFormalName(recordType);

    schemas[recordTypeFormalName] = generateJsonSchemaForRecordType(
      recordType as RecordTypeDef,
      types,
    );
  }

  schemas["Empty"] = { type: "string" }

  return schemas;
}
