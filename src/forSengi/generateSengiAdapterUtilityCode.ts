/**
 * Returns utility types, errors and functions that are used for
 * bridging jsonotron and sengi.
 */
export function generateSengiAdapterUtilityCode() {
  return `
  /**
   * Raised when the api key is missing.
   */
  export class ServiceApiKeyMissingError extends Error {
    constructor() {
      super("Missing x-api-key header.");
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = this.constructor.name;
    }
  }

  /**
   * Raises an error if the given value is not a non-zero length string.
   */
  function ensureApiKeyHeaderValue (value: string|null): string {
    if (typeof value === "string" && value.length > 0) {
      return value
    } else {
      throw new ServiceApiKeyMissingError();
    }
  }
  
  /**
   * The options that can be passed to the createSengiStandardOperations function.
   */
  interface CreateSengiStandardOperationsOptions {
    /**
     * The partition to use when a partition is not supplied with a request.
     */  
    defaultPartition: string
  }  
  `;
}
