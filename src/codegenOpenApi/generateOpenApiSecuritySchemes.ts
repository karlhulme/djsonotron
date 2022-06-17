import { OpenApiSpecSecurityScheme, Service } from "../interfaces/index.ts";

/**
 * Returns a set of OpenAPI security schemes.
 * @param service A service definition.
 */
export function generateOpenApiSecuritySchemes(
  service: Service,
): Record<string, OpenApiSpecSecurityScheme> {
  const securitySchemes: Record<string, OpenApiSpecSecurityScheme> = {};

  if (isServiceUsingApiKeyAuth(service)) {
    securitySchemes.apiKeyAuth = {
      type: "apiKey",
      in: "header",
      name: "x-api-key",
    };
  }

  return securitySchemes;
}

/**
 * Returns true if the given service uses an API Key for
 * authorisation on any of its paths.
 * @param service A service definition.
 */
function isServiceUsingApiKeyAuth(service: Service) {
  for (const path of service.paths) {
    if (path.requireApiKey) {
      return true;
    }
  }

  return false;
}
