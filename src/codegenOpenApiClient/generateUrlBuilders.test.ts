import { assertStringIncludes } from "../../deps.ts";
import { OpenApiSpec } from "../interfaces/index.ts";
import { generateUrlBuilders } from "./generateUrlBuilders.ts";

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
        tags: [],
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
  const code = generateUrlBuilders(exampleOpenApi);

  assertStringIncludes(code, "export interface GetSomethingUrlProps {");
  assertStringIncludes(code, "host: string");
  assertStringIncludes(code, "id: string");
  assertStringIncludes(code, "foo: string");
  assertStringIncludes(code, "bar?: string");

  assertStringIncludes(
    code,
    "export function getSomethingUrl (props: GetSomethingUrlProps) {",
  );
});
