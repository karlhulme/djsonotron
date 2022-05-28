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

/**
 * Raised when the validation of client input fails.
 */
export class ServiceInputValidationError extends Error {
  constructor(readonly message: string, readonly data?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.data = data
  }
}

/**
 * Raised when the validation of service output fails.
 */
export class ServiceOutputValidationError extends Error {
  constructor(readonly message: string, readonly data?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.data = data
  }
}
  `;
}
