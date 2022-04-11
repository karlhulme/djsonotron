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
      }],
      get: {
        operationId: "getSomething",
        parameters: [{
          in: "query",
          name: "foo",
          required: true,
        }, {
          in: "query",
          name: "bar",
          required: false,
        }],
        responses: {},
      },
    },
  },
  components: {
    requestBodies: {},
    schemas: {},
  },
};

Deno.test("Generate operation methods for openapi spec.", () => {
  const code = generateOpMethods(exampleOpenApi);

  assertStringIncludes(code, "export function getSomethingMethod {");
  assertStringIncludes(code, `return "get";`);
});
