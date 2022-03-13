import { RecordTypeDef } from "../interfaces/index.ts";
import { generateRecordTypeValidation } from "./generateRecordTypeValidation.ts";
import { assertEquals } from "../../deps.ts";

const simpleRecord: RecordTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleRecord",
  summary: "A simple integer used for testing",
  properties: [],
  required: ["first", "second"],
  validTestCases: [],
};

Deno.test("Reject a record that does not have the required fields.", () => {
  const fnBody = `
    const errors = []
    
    ${
    generateRecordTypeValidation({
      def: simpleRecord,
      valuePath: "value",
    })
  }

    return errors
  `;

  const fn = new Function("value", fnBody);

  assertEquals(fn({ first: "1st" }), [{
    msg: "Is a required property.",
    valuePath: "value.second",
    typeSystem: "test",
    typeName: "simpleRecord",
  }]);
});
