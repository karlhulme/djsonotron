export function generateUtilityFunctions() {
  return `
export interface HeaderNameValue {
  name: string
  value: string
}

async function getJsonBody(request: Request): Promise<unknown> {
  try {
    const body = await request.body({ type: "json" }).value;
    return body;
  } catch {
    return null;
  }
}

function safeJsonParse(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// deno-lint-ignore no-explicit-any
export function hasDataProp(value: any): value is { data: unknown } {
  return (typeof value === "object" && typeof value.data !== "undefined");
}

export async function errorHandler(ctx: Context, next: () => Promise<unknown>) {
  try {
    await next();
  } catch (err) {
    if (isHttpError(err)) {
      const includeData = hasDataProp(err);
      ctx.response.status = err.status;
      ctx.response.body = {
        message: err.expose ? err.message : "Internal Server Errror",
        data: includeData && err.expose ? err.data : undefined,
      };
    } else {
      // rethrow if you can't handle the error
      // although probably just console.log and soldier on.
      throw err;
    }
  }
}
  `;
}
