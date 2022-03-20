import { ValidationError } from "./ValidationError.ts";

/**
 * Describes the signature of a generated function used
 * to perform validation.
 */
export type ValidationFunction = (value?: unknown | null) => ValidationError[];
