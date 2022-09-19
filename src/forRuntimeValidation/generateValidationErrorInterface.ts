import { TypescriptTreeInterface } from "../../deps.ts";

/**
 * Returns an interface for a validation error.
 */
export function generateValidationErrorInterface(): TypescriptTreeInterface {
  return {
    name: "ValidationError",
    exported: true,
    comment: "Describes a validation error.",
    members: [{
      name: "type",
      typeName: "string",
      comment:
        "The fully qualified name of the type, e.g. std/positiveInteger.",
    }, {
      name: "msg",
      typeName: "string",
      comment: "A message describing the failure.",
    }, {
      name: "valuePath",
      typeName: "string",
      comment:
        `The dotted path to the property that failed validation.  This should by the display path, whereby any array indices have been resolved to a specific element where the validation error occurred.`,
    }, {
      name: "value",
      typeName: "unknown",
      comment: "The value that failed validation.",
    }],
  };
}
