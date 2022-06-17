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
  schema: OpenApiSpecSchema;
}

export interface OpenApiSpecPathOperation {
  summary?: string;
  description?: string;
  deprecated?: boolean;
  tags: string[];
  operationId: string;
  parameters: OpenApiSpecParameter[];
  requestBody?: OpenApiSpecSchema;
  responses: Record<string, OpenApiSpecPathResponse>;
  security: Record<string, unknown[]>[];
}

export interface OpenApiSpecPathResponse {
  description: string;
  content?: Record<string, OpenApiSpecPathResponseContent>;
  headers?: Record<string, OpenApiSpecPathResponseHeader>;
}

export interface OpenApiSpecPathResponseContent {
  schema: OpenApiSpecSchema;
}

export interface OpenApiSpecComponents {
  requestBodies: Record<string, unknown>;
  schemas: Record<string, unknown>;
  securitySchemes: Record<string, OpenApiSpecSecurityScheme>;
}

export interface OpenApiSpecPathResponseHeader {
  description: string;
  deprecated?: boolean;
  schema: OpenApiSpecSchema;
  required?: boolean;
}

export interface OpenApiSpecSchema {
  type?: string;
  title?: string;
  description?: string;
  deprecated?: boolean;
  "$ref"?: string;
}

export interface OpenApiSpecSecurityScheme {
  type: "apiKey";
  in: "query" | "header" | "cookie";
  name: string;
}
