import { stdSystemTypes, testRecord1 } from "../std/index.ts";
import { generateRecordTypeValidation } from "./generateRecordTypeValidation.ts";
import { assertEquals } from "../../deps.ts";

// Deno.test("Reject a record that does not have the required fields.", () => {
//   const fnBody = `
//     const errors = []
    
//     ${
//     generateRecordTypeValidation({
//       def: testRecord1,
//       valuePath: "value",
//       valueDisplayPath: "value",
//       types: stdSystemTypes,
//     })
//   }

//     return errors
//   `;

//   // Deno.writeTextFileSync(
//   //   "./test/fn.ts",
//   //   `export function test(value: any) {\n${fnBody}\n}`,
//   // );

//   const fn = new Function("value", fnBody);

//   assertEquals(fn({ first: [11, 22] }), [{
//     msg: "Is a required property.",
//     valuePath: "value.second",
//     type: "std/testRecord1",
//   }]);
// });
