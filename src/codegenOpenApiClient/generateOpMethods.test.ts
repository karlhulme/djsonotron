import { assertStringIncludes } from "../../deps.ts";
import { OpenApiSpec } from "../interfaces/index.ts";
import { generateOpMethods } from "./generateOpMethods.ts";

const exampleOpenApi: OpenApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Test specification",
    version: "1.0.0",
  },
  paths: {
    "/{id}/something": {
      parameters: [{
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string",
        },
      }],
      get: {
        operationId: "getSomething",
        tags: [],
        parameters: [{
          in: "query",
          name: "foo",
          required: true,
          schema: {
            type: "string",
          },
        }, {
          in: "query",
          name: "bar",
          required: false,
          schema: {
            type: "string",
          },
        }],
        responses: {},
        security: {},
      },
    },
  },
  components: {
    requestBodies: {},
    schemas: {},
    securitySchemes: {},
  },
};

Deno.test("Generate operation methods for openapi spec.", () => {
  const code = generateOpMethods(exampleOpenApi);

  assertStringIncludes(code, "export function getSomethingMethod () {");
  assertStringIncludes(code, `return "get";`);
});
