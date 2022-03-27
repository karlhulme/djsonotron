import {
  EnumTypeDef,
  FloatTypeDef,
  IntTypeDef,
  JsonotronTypeDef,
  StringTypeDef,
} from "../interfaces/index.ts";
import { capitalizeFirstLetter } from "../utils/index.ts";
import { generateBoolTypeValidation } from "./generateBoolTypeValidation.ts";
import { generateEnumTypeValidation } from "./generateEnumTypeValidation.ts";
import { generateFloatTypeValidation } from "./generateFloatTypeValidation.ts";
import { generateIntTypeValidation } from "./generateIntTypeValidation.ts";
import { generateObjectTypeValidation } from "./generateObjectTypeValidation.ts";
import { generateStringTypeValidation } from "./generateStringTypeValidation.ts";

interface RecordTypePropertyValidationProps {
  valuePath: string;
  valueDisplayPath: string;
  def: JsonotronTypeDef;
  types: JsonotronTypeDef[];
}

export function generateRecordTypePropertyValidation(
  props: RecordTypePropertyValidationProps,
) {
  switch (props.def.kind) {
    case "bool":
      return generateBoolTypeValidation({
        def: props.def,
        valuePath: props.valuePath,
        valueDisplayPath: props.valueDisplayPath,
      });
    case "enum":
      return generateEnumTypeValidation({
        def: props.def as EnumTypeDef,
        valuePath: props.valuePath,
        valueDisplayPath: props.valueDisplayPath,
      });
    case "float":
      return generateFloatTypeValidation({
        def: props.def as FloatTypeDef,
        valuePath: props.valuePath,
        valueDisplayPath: props.valueDisplayPath,
      });
    case "int":
      return generateIntTypeValidation({
        def: props.def as IntTypeDef,
        valuePath: props.valuePath,
        valueDisplayPath: props.valueDisplayPath,
      });
    case "object":
      return generateObjectTypeValidation({
        def: props.def,
        valuePath: props.valuePath,
        valueDisplayPath: props.valueDisplayPath,
      });
    case "record":
      return `
        errors.push(
          ...validate${capitalizeFirstLetter(props.def.system)}${
        capitalizeFirstLetter(props.def.name)
      }(${props.valuePath}, ${props.valueDisplayPath})
        );`;
    case "string":
      return generateStringTypeValidation({
        def: props.def as StringTypeDef,
        valuePath: props.valuePath,
        valueDisplayPath: props.valueDisplayPath,
      });
    default:
      throw new Error(`Unrecognised type kind: ${props.def.kind}.`);
  }
}
