import { TypescriptTree } from "../../deps.ts";
import {
  EnumTypeDef,
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  RecordTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { ensureJsonotronTypes } from "../designTimeValidation/index.ts";
import { generateAllRuntimeTypesDeclaration } from "./generateAllRuntimeTypesDeclaration.ts";
import { generateConstDecForEnumType } from "./generateConstDecForEnumType.ts";
import { generateConstDecForEnumTypeArray } from "./generateConstDecForEnumTypeArray.ts";
import { generateConstDecForJsonotronType } from "./generateConstDecForJsonotronType.ts";
import { generateConstDecForJsonotronTypeArray } from "./generateConstDecForJsonotronTypeArray.ts";
import { generateConstDecForRecordType } from "./generateConstDecForRecordType.ts";
import { generateConstDecForRecordTypeArray } from "./generateConstDecForRecordTypeArray.ts";
import { generateRuntimeTypeInterface } from "./generateRuntimeTypeInterface.ts";
import { generateStringUnionsForTypeSystems } from "./generateStringUnionsForTypeSystems.ts";
import { generateValidateArrayFunc } from "./generateValidateArrayFunc.ts";
import { generateValidateArrayTypeFunc } from "./generateValidateArrayTypeFunc.ts";
import { generateValidateBoolTypeFunc } from "./generateValidateBoolTypeFunc.ts";
import { generateValidateVariantTypeFunc } from "./generateValidateVariantTypeFunc.ts";
import {
  generateEnumTypeEnumConstArray,
  generateValidateEnumTypeFunc,
} from "./generateValidateEnumTypeFunc.ts";
import { generateValidateFloatTypeFunc } from "./generateValidateFloatTypeFunc.ts";
import { generateValidateIntTypeFunc } from "./generateValidateIntTypeFunc.ts";
import { generateValidateObjectTypeFunc } from "./generateValidateObjectTypeFunc.ts";
import {
  generateRecordTypeInterface,
  generateValidateRecordTypeFunc,
} from "./generateValidateRecordTypeFunc.ts";
import { generateValidateStringTypeFunc } from "./generateValidateStringTypeFunc.ts";
import { generateValidationErrorInterface } from "./generateValidationErrorInterface.ts";
import { generateValidatorWithStringOutputWrapper } from "./generateValidatorWithStringOutputWrapper.ts";

/**
 * Appends the given Jsontron types to the given typescript tree.
 * @param tree A typescript tree.
 * @param types An array of Jsonotron type definitions.
 * @param componentSchemasPath The path where the component schemas will be placed
 * and can be referenced from.
 */
export function appendJsonotronTypesToTree(
  tree: TypescriptTree,
  types: JsonotronTypeDef[],
  componentSchemasPath = "#/components/schemas/",
) {
  ensureJsonotronTypes(types);

  tree.lintDirectives.ignoreNoExplicitAny = true;

  tree.interfaces.push(generateValidationErrorInterface());
  tree.interfaces.push(generateRuntimeTypeInterface());

  tree.functions.push(generateValidatorWithStringOutputWrapper());
  tree.functions.push(generateValidateArrayFunc());

  for (const type of types) {
    if (type.kind === "bool") {
      tree.functions.push(generateValidateBoolTypeFunc(type));
      tree.constDeclarations.push(
        generateConstDecForJsonotronType(type),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronTypeArray(type, componentSchemasPath),
      );
    } else if (type.kind === "enum") {
      tree.enumConstArrays.push(
        generateEnumTypeEnumConstArray(type as EnumTypeDef),
      );
      tree.functions.push(generateValidateEnumTypeFunc(type as EnumTypeDef));
      tree.constDeclarations.push(
        generateConstDecForEnumType(type as EnumTypeDef),
      );
      tree.constDeclarations.push(
        generateConstDecForEnumTypeArray(
          type as EnumTypeDef,
          componentSchemasPath,
        ),
      );
    } else if (type.kind === "float") {
      tree.functions.push(generateValidateFloatTypeFunc(type as FloatTypeDef));
      tree.constDeclarations.push(
        generateConstDecForJsonotronType(type),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronTypeArray(type, componentSchemasPath),
      );
    } else if (type.kind === "int") {
      tree.functions.push(generateValidateIntTypeFunc(type as IntTypeDef));
      tree.constDeclarations.push(
        generateConstDecForJsonotronType(type),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronTypeArray(type, componentSchemasPath),
      );
    } else if (type.kind === "object") {
      tree.functions.push(
        generateValidateObjectTypeFunc(type as JsonotronTypeDef),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronType(type),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronTypeArray(type, componentSchemasPath),
      );
    } else if (type.kind === "record") {
      tree.interfaces.push(
        generateRecordTypeInterface(type as RecordTypeDef<string>, types),
      );
      tree.functions.push(
        generateValidateRecordTypeFunc(type as RecordTypeDef<string>, types),
      );
      tree.constDeclarations.push(
        generateConstDecForRecordType(
          type as RecordTypeDef<string>,
          types,
          componentSchemasPath,
        ),
      );
      tree.constDeclarations.push(
        generateConstDecForRecordTypeArray(
          type as RecordTypeDef<string>,
          componentSchemasPath,
        ),
      );
    } else if (type.kind === "string") {
      tree.functions.push(
        generateValidateStringTypeFunc(type as StringTypeDef),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronType(type),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronTypeArray(type, componentSchemasPath),
      );
    } else if (type.kind === "variant") {
      tree.functions.push(
        generateValidateVariantTypeFunc(type),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronType(type),
      );
      tree.constDeclarations.push(
        generateConstDecForJsonotronTypeArray(type, componentSchemasPath),
      );
    }

    tree.functions.push(generateValidateArrayTypeFunc(type));
  }

  tree.stringUnions.push(
    ...generateStringUnionsForTypeSystems(types),
  );

  tree.constDeclarations.push(generateAllRuntimeTypesDeclaration(types));
}
