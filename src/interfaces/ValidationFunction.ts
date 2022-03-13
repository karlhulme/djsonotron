import { ValidationResult } from "./ValidationResult.ts";

/**
 * Describes the signature of a generated function used
 * to perform validation.
 */
export type ValidationFunction = (value: unknown) => ValidationResult;
