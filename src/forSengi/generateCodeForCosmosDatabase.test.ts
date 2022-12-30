import { generateCodeForCosmosDatabase } from "./generateCodeForCosmosDatabase.ts";
import { assertStringIncludes, assertThrows } from "../../deps.ts";

Deno.test("Ensure that code can be generated for interacting with a cosmos database.", () => {
  // To cover code generation we need document collections that are:
  // * useSinglePartition: true / false
  // * policy: defined or undefined
  // * records: defined or undefined
  // * enums: defined or undefined

  const sourceCode = generateCodeForCosmosDatabase({
    appName: "test",
    svcName: "run",
    defaultCosmosDb: "testDb",
    defaultCosmosKey: "abcd",
    defaultCosmosUrl: "https://db.test.local",
    collections: [{
      "$schema":
        "https://raw.githubusercontent.com/karlhulme/djsonotron/main/schemas/sengi.json",
      "system": "db",
      "name": "movie",
      "pluralName": "movies",
      "idPrefix": "mov",
      "useSinglePartition": true,
      "summary": "A movie",
      "redactFields": [],
      "changeFieldNames": [],
      "storePatches": true,
      "trackChanges": true,
      "policy": {
        "canDeleteDocuments": true,
      },
      "properties": [
        {
          "name": "title",
          "summary": "The title of the movie.",
          "propertyType": "std/shortStringDisplayable",
          "isRequired": true,
        },
      ],
      "types": {
        "records": [{
          "name": "sub",
          "pluralName": "subs",
          "summary": "A sub record.",
          "properties": [
            {
              "name": "name",
              "summary": "The name of a field.",
              "propertyType": "std/shortString",
              "isRequired": true,
            },
          ],
        }],
        "enums": [{
          "name": "choice",
          "pluralName": "choices",
          "summary": "A choice.",
          "items": [
            {
              "value": "first",
              "summary": "The first choice.",
            },
            {
              "value": "second",
              "summary": "The second choice.",
            },
          ],
        }],
      },
    }, {
      "$schema":
        "https://raw.githubusercontent.com/karlhulme/djsonotron/main/schemas/sengi.json",
      "system": "db",
      "name": "album",
      "pluralName": "albums",
      "idPrefix": "alb",
      "useSinglePartition": false,
      "summary": "An album",
      "redactFields": [],
      "changeFieldNames": [],
      "storePatches": false,
      "trackChanges": false,
      "properties": [
        {
          "name": "releaseDate",
          "summary": "The release date of the album.",
          "propertyType": "std/date",
          "isRequired": true,
        },
      ],
    }],
    depsPath: "../deps.ts",
  });

  assertStringIncludes(sourceCode, "patchDbMovie");
  assertStringIncludes(sourceCode, "selectDbAlbumsByFilter");
});

Deno.test("Fail to generate cosmos database code for an invalid document collection.", () => {
  assertThrows(() =>
    generateCodeForCosmosDatabase({
      appName: "test",
      svcName: "run",
      defaultCosmosDb: "testDb",
      defaultCosmosKey: "abcd",
      defaultCosmosUrl: "https://db.test.local",
      collections: [{
        not: "valid",
      }],
      depsPath: "../deps.ts",
    })
  );
});
