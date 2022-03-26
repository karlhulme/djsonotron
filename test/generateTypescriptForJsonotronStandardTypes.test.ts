import { generateTypescriptForJsonotronTypes, stdSystemTypes } from "../mod.ts";
import { assertStringIncludes } from "../deps.ts";

Deno.test("Generate typescript for jsonotron standard types.", () => {
  const tsFileContents = generateTypescriptForJsonotronTypes(stdSystemTypes);
  assertStringIncludes(tsFileContents, "export interface ValidationError");
  assertStringIncludes(tsFileContents, "export const stdDayOfWeekValues");
  assertStringIncludes(tsFileContents, "export type StdDayOfWeek");
  assertStringIncludes(tsFileContents, "export interface StdLongLat");
  assertStringIncludes(tsFileContents, "export function validateStdLongLat");
  assertStringIncludes(tsFileContents, "export const stdMonthOfYearValues");
  assertStringIncludes(tsFileContents, "export type StdMonthOfYear");
  assertStringIncludes(tsFileContents, "export const stdYesNoValues");
  assertStringIncludes(tsFileContents, "export type StdYesNo");
});
