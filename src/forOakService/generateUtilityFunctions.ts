export function generateUtilityFunctions() {
  return `
export interface HeaderNameValue {
  name: string
  value: string
}

/**
 * Returns the JSON body of the given request.
 */
async function getJsonBody(request: Request): Promise<unknown> {
  try {
    const body = await request.body({ type: "json" }).value;
    return body;
  } catch (err) {
    return undefined;
  }
}

/**
 * Returns the JSON object created by parsing the given text.
 */
function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (err) {
    return undefined;
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
  }
}

/**
 * Raised by a service when an HTTP error code in the 400-499
 * range should be returned to the client.
 */
export class ServiceRequestError extends Error {
  constructor(readonly status: number, readonly message: string) {
    super(status.toString() + ": " + message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }
}
  `;
}
