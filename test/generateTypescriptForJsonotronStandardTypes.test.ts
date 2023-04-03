import { generateCodeForJsonotronTypes, stdSystemTypes } from "../mod.ts";
import { assertStringIncludes } from "../deps.ts";

Deno.test("Generate typescript for jsonotron standard types.", () => {
  const sourceCode = generateCodeForJsonotronTypes(stdSystemTypes);
  assertStringIncludes(sourceCode, "export interface ValidationError");
  assertStringIncludes(sourceCode, "export const allStdDayOfWeekValues");
  assertStringIncludes(sourceCode, "export type StdDayOfWeek");
  assertStringIncludes(sourceCode, "export type StdRecordStatus");
  assertStringIncludes(sourceCode, "export interface StdLongLat");
  assertStringIncludes(sourceCode, "export function validateStdLongLat");
});
