/**
 * Returns an HTML page that generates documentation based on the openapi
 * specification that is expected to be at the /openapi path.
 */
export function generateOakRouterPathForRoot() {
  const lines: string[] = [];

  const rapidocApiDocs = `
    <!doctype html> <!-- Important: must specify -->
    <html>
    <head>
      <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
      <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
    </head>
    <body>
      <rapi-doc
        spec-url="/openapi"
        theme = "dark"
      > </rapi-doc>
    </body>
    </html>
  `;

  lines.push(`  .get("/", (ctx) => {
    ctx.response.body = \`${rapidocApiDocs}\`
  })`);

  return lines;
}
