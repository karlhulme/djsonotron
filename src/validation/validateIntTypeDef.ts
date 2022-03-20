import { IntTypeDef, TypeDefValidationError } from "../interfaces/index.ts";

export function validateIntTypeDef(
  def: IntTypeDef,
  errors: TypeDefValidationError[],
) {
  if (def.minimum > def.maximum) {
    errors.push({
      type: `${def.system}/${def.name}`,
      kind: "minimumMaximumInverted",
      msg: "The minimum value must be less than or equal to the maximum value.",
    });
  }
}
