import { assertStrictEquals } from "../../deps.ts";
import { generateCodeForService } from "./generateCodeForService.ts";

Deno.test("Generate the code for a service with a path with all ops defined.", () => {
  const code = generateCodeForService({
    service: {
      info: {
        title: "Test service",
        version: "1.0.0",
      },
      servers: [],
      paths: [{
        path: "example",
        summary: "An example path",
        delete: {
          operationName: "deleteExample",
          summary: "Deletes an example.",
          requestBodyType: "svc/getExampleRequestBody",
          requestQueryType: "svc/getExampleRequestQuery",
          responseBodyType: "svc/getExampleResponseBody",
        },
        get: {
          operationName: "getExample",
          summary: "Retrieves an example.",
          requestBodyType: "svc/getExampleRequestBody",
          requestQueryType: "svc/getExampleRequestQuery",
          responseBodyType: "svc/getExampleResponseBody",
        },
        patch: {
          operationName: "patchExample",
          summary: "Patch an example.",
          requestBodyType: "svc/getExampleRequestBody",
          requestQueryType: "svc/getExampleRequestQuery",
          responseBodyType: "svc/getExampleResponseBody",
        },
        post: {
          operationName: "postExample",
          summary: "Create an example.",
          requestBodyType: "svc/getExampleRequestBody",
          requestQueryType: "svc/getExampleRequestQuery",
          responseBodyType: "svc/getExampleResponseBody",
        },
        put: {
          operationName: "putExample",
          summary: "Insert an example.",
          requestBodyType: "svc/getExampleRequestBody",
          requestQueryType: "svc/getExampleRequestQuery",
          responseBodyType: "svc/getExampleResponseBody",
        },
      }],
    },
    typesPath: "./types.autogen.ts",
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
        path: "example",
        summary: "An example path",
        delete: {
          operationName: "deleteExample",
          summary: "Deletes an example.",
        },
        get: {
          operationName: "getExample",
          summary: "Retrieves an example.",
        },
        patch: {
          operationName: "patchExample",
          summary: "Patch an example.",
        },
        post: {
          operationName: "postExample",
          summary: "Create an example.",
        },
        put: {
          operationName: "putExample",
          summary: "Insert an example.",
        },
      }],
    },
    typesPath: "./types.autogen.ts",
    depsPath: "../../deps.ts",
  });

  assertStrictEquals(typeof code, "string");
});
