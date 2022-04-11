import { assertStrictEquals, stringifyYaml } from "../../deps.ts";
import { OpenApiSpec } from "../interfaces/index.ts";
import { generateOpenApiClient } from "./generateOpenApiClient.ts";

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
    schemas: {
      SvcExampleType: {
        type: "object",
        properties: {
          a: {
            type: "string",
          },
          b: {
            type: "number",
          },
          c: {
            $ref: "/#/components/schemas/SvcExampleEnum",
          },
        },
        required: [
          "a",
        ],
      },
      SvcExampleEnum: {
        type: "string",
        enum: [
          "valueA",
          "valueB",
          "valueC",
        ],
      },
    },
  },
};

Deno.test("Generate client code for an openapi service definition.", () => {
  const yaml = stringifyYaml(
    exampleOpenApi as unknown as Record<string, unknown>,
  );

  const code = generateOpenApiClient({
    openApiDefinition: yaml,
  });

  // console.log(code);
  assertStrictEquals(typeof code, "string");
});
