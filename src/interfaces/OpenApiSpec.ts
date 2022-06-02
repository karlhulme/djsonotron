export interface OpenApiSpec {
  openapi: "3.0.3";
  info: OpenApiSpecInfo;
  servers?: OpenApiSpecServer[];
  paths: Record<string, OpenApiSpecPath>;
  components: OpenApiSpecComponents;
}

export interface OpenApiSpecInfo {
  title: string;
  description?: string;
  termsOfService?: string;
  version: string;
}

export interface OpenApiSpecServer {
  url: string;
  description?: string;
}

export interface OpenApiSpecPath {
  summary?: string;
  description?: string;
  delete?: OpenApiSpecPathOperation;
  get?: OpenApiSpecPathOperation;
  patch?: OpenApiSpecPathOperation;
  post?: OpenApiSpecPathOperation;
  put?: OpenApiSpecPathOperation;
  parameters: OpenApiSpecParameter[];
}

export interface OpenApiSpecParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  description?: string;
  required: boolean;
  deprecated?: boolean;
}

export interface OpenApiSpecPathOperation {
  summary?: string;
  description?: string;
  operationId: string;
  parameters: OpenApiSpecParameter[];
  requestBody?: OpenApiSpecReference;
  responses: Record<string, OpenApiSpecPathResponse>;
}

export interface OpenApiSpecPathResponse {
  description: string;
  content?: Record<string, OpenApiSpecPathResponseContent>;
}

export interface OpenApiSpecPathResponseContent {
  schema: OpenApiSpecReference;
}

export interface OpenApiSpecReference {
  "$ref": string;
}

export interface OpenApiSpecComponents {
  requestBodies: Record<string, unknown>;
  schemas: Record<string, unknown>;
}
