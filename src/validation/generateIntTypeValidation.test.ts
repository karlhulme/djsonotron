import { IntTypeDef } from "../interfaces/index.ts";
import { generateIntTypeValidation } from "./generateIntTypeValidation.ts";
import { assertEquals } from "../../deps.ts";

const simpleInt: IntTypeDef = {
  kind: "int",
  system: "test",
  name: "simpleInt",
  summary: "A simple integer used for testing",
  minimum: 5,
  maximum: 8,
};

Deno.test("Validate an integer that is in range.", () => {
  const fnBody = `
    const errors = []
    
    ${
    generateIntTypeValidation({
      def: simpleInt,
      valuePath: "value",
    })
  }

    return errors
  `;

  const fn = new Function("value", fnBody);

  assertEquals(fn(6), []);
});

Deno.test("Fail to validate an integer that is out of range.", () => {
  const fnBody = `
    const errors = []
    
    ${
    generateIntTypeValidation({
      def: simpleInt,
      valuePath: "value",
    })
  }

    return errors
  `;

  const fn = new Function("value", fnBody);

  assertEquals(fn(4), [{
    msg: "Should be greater than or equal to 5.",
    valuePath: "value",
    typeSystem: "test",
    typeName: "simpleInt",
  }]);
});
