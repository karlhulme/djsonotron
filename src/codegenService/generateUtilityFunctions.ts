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
    return undefined;
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (err) {
    return { __invalidJson: text };
  }
}

export function hasDataProp(value: any): value is { data: unknown } {
  return (typeof value === "object" && typeof value.data !== "undefined");
}

/**
 * Raised when the api key is missing.
 */
export class ServiceAuthorisationHeaderError extends Error {
  constructor(readonly message: string, readonly data?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.data = data
  }
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
