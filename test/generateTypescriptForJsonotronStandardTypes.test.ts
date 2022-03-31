import { generateCodeForJsonotronTypes, stdSystemTypes } from "../mod.ts";
import { assertStringIncludes } from "../deps.ts";

Deno.test("Generate typescript for jsonotron standard types.", () => {
  const sourecCode = generateCodeForJsonotronTypes(stdSystemTypes);
  assertStringIncludes(sourecCode, "export interface ValidationError");
  assertStringIncludes(sourecCode, "export const stdDayOfWeekValues");
  assertStringIncludes(sourecCode, "export type StdDayOfWeek");
  assertStringIncludes(sourecCode, "export interface StdLongLat");
  assertStringIncludes(sourecCode, "export function validateStdLongLat");
  assertStringIncludes(sourecCode, "export const stdMonthOfYearValues");
  assertStringIncludes(sourecCode, "export type StdMonthOfYear");
  assertStringIncludes(sourecCode, "export const stdYesNoValues");
  assertStringIncludes(sourecCode, "export type StdYesNo");
});
