import { assertStrictEquals } from "../../deps.ts";
import { RecordTypeDef } from "../interfaces/index.ts";
import { stdSystemTypes } from "../std/index.ts";
import { generateOpenApiService } from "./generateOpenApiService.ts";

const exampleType: RecordTypeDef = {
  kind: "record",
  system: "test",
  name: "exampleType",
  pluralName: "exampleTypes",
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
        requireApiKey: true,
        delete: {
          operationName: "putExample",
          summary: "Insert an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          responseSuccessCode: 204,
        },
        get: {
          operationName: "getExample",
          summary: "Retrieves an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          responseBodyType: "test/exampleType",
          responseBodyTypeArray: true,
          responseSuccessCode: 200,
        },
        patch: {
          operationName: "patchExample",
          summary: "Patch an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          requestBodyTypeArray: true,
          responseBodyType: "test/exampleType",
          responseSuccessCode: 200,
        },
        post: {
          operationName: "postExample",
          summary: "Create an example.",
          tags: [],
          requestBodyType: "test/exampleType",
          responseBodyType: "test/exampleType",
          responseSuccessCode: 201,
        },
        put: {
          operationName: "deleteExample",
          summary: "Deletes an example.",
          tags: [],
          requestQueryParams: [{
            name: "p1",
            paramType: "test/exampleType",
            summary: "An example parameter",
            isRequired: true,
          }],
          requestBodyType: "test/exampleType",
          responseBodyType: "test/exampleType",
          responseSuccessCode: 200,
        },
      }],
    },
    types: [exampleType, ...stdSystemTypes],
  });

  // console.log(JSON.stringify(openApiService, null, 2));
  assertStrictEquals(typeof openApiService, "object");
});
