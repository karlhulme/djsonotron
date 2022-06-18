/**
 * Returns utility types, errors and functions that are used for
 * bridging jsonotron and sengi.
 */
export function generateSengiAdapterUtilityCode() {
  return `
  /**
   * Raised when a requested document was not found.
   */
  export class ServiceDocNotFoundError extends Error {
    constructor() {
      super("A requested document was not found.");
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = this.constructor.name;
    }
  }

  /**
   * Raised when an attempt is made to replace a document
   * but the id in the request url does not match the id
   * in the document.
   */
  export class ServiceDocIdMismatchError extends Error {
    constructor() {
      super("The id in the url does not match the id in the given document.");
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = this.constructor.name;
    }
  }
  
  /**
   * The options that can be passed to the createSengiAdapterOperations function.
   */
  interface CreateSengiAdapterOperationsOptions {
    /**
     * A temp property so that the options definition is valid.
     */  
    foo?: string
  }

  /**
   * Splits the given comma-separated list of field names
   * into an array.  If the given array does not contain
   * the id field then it will be added.
   */
  export function splitCsvFieldNames (csvFieldNames?: string) {
    const fieldNames = (csvFieldNames || "").split(",");

    if (!fieldNames.includes("id")) {
      fieldNames.push("id");
    }

    return fieldNames;
  }

  /**
   * Splits the given comma-separated list of claims
   * into an array.
   */
  export function splitCsvClaims (csvClaims?: string) {
    return (csvClaims || "").split(",");
  }

  /**
   * Returns a function that takes a document, validates it using the given
   * validator, and if said validator yields one validation error or more,
   * then the validation errors are stringified.
   * @param validator A validator function that returns an array of valiation errors.
   */
  export function v(
    validator: (value: unknown, valueDisplayPath: string) => ValidationError[],
  ): (doc: unknown) => string | void {
    return function (doc: unknown): string | void {
      const errors = validator(doc, "doc");

      if (errors.length > 0) {
        return JSON.stringify(errors, null, 2);
      }
    };
  }
  `;
}
