import { JsonotronTypeDef, OpenApiSpec, Service } from "../interfaces/index.ts";
import { generateOpenApiServicePathsNode } from "./generateOpenApiServicePathsNode.ts";
import { generateJsonSchemasForJsonotronTypes } from "./generateJsonSchemasForJsonotronTypes.ts";
import { generateRequestBodiesForOperations } from "./generateRequestBodiesForOperations.ts";
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
    servers: props.service.servers.map((svr) => ({
      url: svr.url,
      description: svr.description,
    })),
    paths: generateOpenApiServicePathsNode(props.service, props.types),
    components: {
      requestBodies: generateRequestBodiesForOperations(
        props.service,
        props.types,
      ),
      schemas: generateJsonSchemasForJsonotronTypes(referencedTypes),
    },
  };
  console.log(JSON.stringify(openApiSpec, null, 2));
  return openApiSpec;
}
