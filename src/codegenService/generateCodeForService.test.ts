import { assertStrictEquals } from "../../deps.ts";
import { RecordTypeDef } from "../interfaces/index.ts";
import { stdSystemTypes } from "../std/index.ts";
import { generateCodeForService } from "./generateCodeForService.ts";

const exampleType: RecordTypeDef = {
  kind: "record",
  system: "test",
  name: "exampleType",
  summary: "An example body record.",
  properties: [{
    name: "text",
    propertyType: "shortString",
    summary: "A text field",
  }],
};

Deno.test("Generate the code for a service with a path with all ops defined.", () => {
  const code = generateCodeForService({
    service: {
      info: {
        title: "Test service",
        version: "1.0.0",
      },
      servers: [],
      paths: [{
        relativeUrl: "/example/{id:uuid}/{pageSize:std/positiveInteger}",
        summary: "An example path",
        delete: {
          operationName: "deleteExample",
          summary: "Deletes an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        get: {
          operationName: "getExample",
          summary: "Retrieves an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        patch: {
          operationName: "patchExample",
          summary: "Patch an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        post: {
          operationName: "postExample",
          summary: "Create an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        put: {
          operationName: "putExample",
          summary: "Insert an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
      }],
    },
    typesPath: "./types.autogen.ts",
    types: [exampleType, ...stdSystemTypes],
    depsPath: "../../deps.ts",
  });

  // console.log(code);
  assertStrictEquals(typeof code, "string");
});

Deno.test("Generate the code for a service with a path with no types required.", () => {
  const code = generateCodeForService({
    service: {
      info: {
        title: "Test service",
        version: "1.0.0",
      },
      servers: [],
      paths: [{
        relativeUrl: "/example",
        summary: "An example path",
        delete: {
          operationName: "deleteExample",
          summary: "Deletes an example.",
          tags: [],
        },
        get: {
          operationName: "getExample",
          summary: "Retrieves an example.",
          tags: [],
        },
        patch: {
          operationName: "patchExample",
          summary: "Patch an example.",
          tags: [],
        },
        post: {
          operationName: "postExample",
          summary: "Create an example.",
          tags: [],
        },
        put: {
          operationName: "putExample",
          summary: "Insert an example.",
          tags: [],
        },
      }],
    },
    typesPath: "./types.autogen.ts",
    types: [],
    depsPath: "../../deps.ts",
  });

  assertStrictEquals(typeof code, "string");
});
