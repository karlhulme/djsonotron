import { generateCodeForMongoDatabase } from "./generateCodeForMongoDatabase.ts";
import { assertStringIncludes, assertThrows } from "../../deps.ts";
import {
  createCollectionWithSubTypes,
  createSimpleCollection,
} from "./shared.test.ts";

Deno.test("Ensure that code can be generated for interacting with a mongo database.", () => {
  // To cover code generation we need document collections that are:
  // * useSinglePartition: true / false
  // * policy: defined or undefined
  // * records: defined or undefined
  // * enums: defined or undefined

  const sourceCode = generateCodeForMongoDatabase({
    appName: "test",
    svcName: "run",
    collections: [
      createSimpleCollection(),
      createCollectionWithSubTypes(),
    ],
    depsPath: "../deps.ts",
  });

  assertStringIncludes(sourceCode, "patchDbMovie");
  assertStringIncludes(sourceCode, "selectDbAlbumsByFilter");
});

Deno.test("Fail to generate mongo database code for an invalid document collection.", () => {
  assertThrows(() =>
    generateCodeForMongoDatabase({
      appName: "test",
      svcName: "run",
      collections: [{
        not: "valid",
      }],
      depsPath: "../deps.ts",
    })
  );
});
