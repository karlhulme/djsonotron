import {
  JsonotronTypeDef,
  RecordTypeDef,
  TypeDefValidationError,
} from "../interfaces/index.ts";
import {
  getSystemFromTypeString,
  getTypeFromTypeString,
} from "../utils/index.ts";
import {
  createValidationFunction,
  generateRecordTypeValidation,
} from "../codegenValidationClauses/index.ts";

export function validateRecordTypeDef(
  def: RecordTypeDef,
  types: JsonotronTypeDef[],
  errors: TypeDefValidationError[],
) {
  for (const property of def.properties) {
    const propertySystem = getSystemFromTypeString(
      property.propertyType,
      def.system,
    );
    const propertyTypeName = getTypeFromTypeString(property.propertyType);
    const propertyValueTypeDef = types.find((t) =>
      t.system === propertySystem && t.name === propertyTypeName
    );

    if (!propertyValueTypeDef) {
      errors.push({
        type: `${def.system}/${def.name}`,
        kind: "unrecognisedPropertyType",
        msg:
          `Property '${property.name}' references unknown type '${property.propertyType}'.`,
      });
    }
  }

  const fnBody = generateRecordTypeValidation({
    def,
    valueDisplayPath: "value",
    valuePath: "value",
    types,
  });

  const fn = createValidationFunction(fnBody);

  if (Array.isArray(def.validTestCases)) {
    for (
      let testCaseNo = 0;
      testCaseNo < def.validTestCases.length;
      testCaseNo++
    ) {
      const testCase = def.validTestCases[testCaseNo];
      const testCaseErrors = fn(testCase.value);

      if (testCaseErrors.length > 0) {
        errors.push({
          type: `${def.system}/${def.name}`,
          kind: "validTestCaseRejected",
          msg: `Valid test case ${testCaseNo} was rejected.`,
          errors: testCaseErrors,
        });
      }
    }
  }

  if (Array.isArray(def.invalidTestCases)) {
    for (
      let testCaseNo = 0;
      testCaseNo < def.invalidTestCases.length;
      testCaseNo++
    ) {
      const invalidTestCase = def.invalidTestCases[testCaseNo];
      const invalidTestCaseErrors = fn(invalidTestCase.value);

      if (invalidTestCaseErrors.length === 0) {
        errors.push({
          type: `${def.system}/${def.name}`,
          kind: "invalidTestCaseAccepted",
          msg: `Invalid test case ${testCaseNo} was accepted but should fail.`,
        });
      }
    }
  }
}
