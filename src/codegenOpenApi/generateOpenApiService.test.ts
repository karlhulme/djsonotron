import { assertStrictEquals } from "../../deps.ts";
import { RecordTypeDef } from "../interfaces/index.ts";
import { stdSystemTypes } from "../std/index.ts";
import { generateOpenApiService } from "./generateOpenApiService.ts";

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

Deno.test("Generate an openapi service definition for a service with a path with all ops defined.", () => {
  const openApiService = generateOpenApiService({
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
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        get: {
          operationName: "getExample",
          summary: "Retrieves an example.",
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        patch: {
          operationName: "patchExample",
          summary: "Patch an example.",
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        post: {
          operationName: "postExample",
          summary: "Create an example.",
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
        put: {
          operationName: "putExample",
          summary: "Insert an example.",
          requestBodyType: "test/exampleType",
          requestQueryType: "test/exampleType",
          responseBodyType: "test/exampleType",
        },
      }],
    },
    types: [exampleType, ...stdSystemTypes],
  });

  // console.log(JSON.stringify(openApiService, null, 2));
  assertStrictEquals(typeof openApiService, "object");
});
