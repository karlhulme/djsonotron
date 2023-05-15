import { generateCodeForCosmosDatabase } from "./generateCodeForCosmosDatabase.ts";
import { assertStringIncludes, assertThrows } from "../../deps.ts";
import {
  createCollectionWithSubTypes,
  createSimpleCollection,
} from "./shared.test.ts";

Deno.test("Ensure that code can be generated for interacting with a cosmos database.", () => {
  // To cover code generation we need document collections that are:
  // * useSinglePartition: true / false
  // * policy: defined or undefined
  // * records: defined or undefined
  // * enums: defined or undefined
  // * systemUserId: defined or undefined

  const sourceCode = generateCodeForCosmosDatabase({
    appName: "test",
    svcName: "run",
    collections: [
      createSimpleCollection(),
      createCollectionWithSubTypes(),
    ],
    depsPath: "../deps.ts",
    systemUserId: "user_bespokeSysUser",
  });

  assertStringIncludes(sourceCode, "patchDbMovie");
  assertStringIncludes(sourceCode, "selectDbAlbumsByFilter");
});

Deno.test("Fail to generate cosmos database code for an invalid document collection.", () => {
  assertThrows(() =>
    generateCodeForCosmosDatabase({
      appName: "test",
      svcName: "run",
      collections: [{
        not: "valid",
      }],
      depsPath: "../deps.ts",
    })
  );
});
