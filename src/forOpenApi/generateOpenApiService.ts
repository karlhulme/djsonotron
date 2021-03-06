import { OpenApiSpec } from "../../deps.ts";
import { JsonotronTypeDef, Service } from "../interfaces/index.ts";
import { generateOpenApiSecuritySchemes } from "./generateOpenApiSecuritySchemes.ts";
import { generateOpenApiServicePathsNode } from "./generateOpenApiServicePathsNode.ts";
import { generateJsonSchemasForJsonotronTypes } from "./generateJsonSchemasForJsonotronTypes.ts";
import { generateJsonSchemasForRequestBodyParams } from "./generateJsonSchemasForRequestBodyParams.ts";
import { getTypesReferencedByServiceDeep } from "./getTypesReferencedByServiceDeep.ts";

interface GenerateOpenApiServiceProps {
  service: Service;
  types: JsonotronTypeDef[];
}

export function generateOpenApiService(
  props: GenerateOpenApiServiceProps,
) {
  const referencedTypes = getTypesReferencedByServiceDeep(
    props.service,
    props.types,
  );

  const openApiSpec: OpenApiSpec = {
    openapi: "3.0.3",
    info: {
      title: props.service.info.title,
      description: props.service.info.description,
      version: props.service.info.version,
    },
    servers: Array.isArray(props.service.servers)
      ? props.service.servers.map((svr) => ({
        url: svr.url,
        description: svr.description,
      }))
      : [{
        url: "/",
        description: "This service.",
      }],
    paths: generateOpenApiServicePathsNode(props.service, props.types),
    components: {
      schemas: {
        ...generateJsonSchemasForJsonotronTypes(referencedTypes),
        ...generateJsonSchemasForRequestBodyParams(props.service, props.types),
      },
      securitySchemes: generateOpenApiSecuritySchemes(props.service),
    },
  };

  return openApiSpec;
}
