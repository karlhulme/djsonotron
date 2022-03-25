// deno-lint-ignore-file no-explicit-any
// This file was automatically generated.

/**
 * Describes a validation error.
 */
export interface ValidationError {
  /**
   * The fully qualified name of the type, e.g. std/positiveInteger.
   */
  type: string;

  /**
   * A message describing the failure.
   */
  msg: string;

  /**
   * The dotted path to the property that failed validation.
   * This should by the display path, whereby any array indices
   * have been resolved to a specific element where the validation
   * error occurred.
   */
  valuePath: string;

  /**
   * The value that failed validation.
   */
  value: unknown;
}

/**
 * An array of the values of the std/DayOfWeek enum.
 */
export const stdDayOfWeekValues = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

/**
 * A day of the week.
 */
export type StdDayOfWeek =
  typeof stdDayOfWeekValues[keyof typeof stdDayOfWeekValues];

/**
 * A GPS co-ordinate represented as a longitudinal and latitudinal position.
 */
export interface StdLongLat {
  /**
   * The longitudinal position.
   */
  longitude: number;

  /**
   * The latitudinal position.
   */
  latitude: number;
}

/**
 * Validate the given object to ensure it is a valid std/longLat record.
 */
export function validateStdLongLat(value: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    errors.push({
      valuePath: `value`,
      value: value,
      msg: "Value must be an object (non null and not an array).",
      type: "std/longLat",
    });
  } else {
    if (typeof value.longitude === "undefined") {
      errors.push({
        valuePath: `value.longitude`,
        value: value.longitude,
        msg: "Value is a required property and cannot be undefined.",
        type: "longitudeFloat",
      });
    }

    if (value.longitude === null) {
      errors.push({
        valuePath: `value.longitude`,
        value: value.longitude,
        msg: "Value must not be null.",
        type: "longitudeFloat",
      });
    }

    if (typeof value.longitude !== "undefined") {
      if (value.longitude !== null) {
        if (typeof value.longitude !== "number") {
          errors.push({
            valuePath: `value`,
            value: value.longitude,
            msg: "Value must be a number.",
            type: "std/longitudeFloat",
          });
        } else {
          if (value.longitude < -180) {
            errors.push({
              valuePath: `value`,
              value: value.longitude,
              msg: "Value must be greater than or equal to -180.",
              type: "std/longitudeFloat",
            });
          }

          if (value.longitude > 180) {
            errors.push({
              valuePath: `value`,
              value: value.longitude,
              msg: "Value must be less than or equal to 180.",
              type: "std/longitudeFloat",
            });
          }
        }
      }
    }

    if (typeof value.latitude === "undefined") {
      errors.push({
        valuePath: `value.latitude`,
        value: value.latitude,
        msg: "Value is a required property and cannot be undefined.",
        type: "latitudeFloat",
      });
    }

    if (value.latitude === null) {
      errors.push({
        valuePath: `value.latitude`,
        value: value.latitude,
        msg: "Value must not be null.",
        type: "latitudeFloat",
      });
    }

    if (typeof value.latitude !== "undefined") {
      if (value.latitude !== null) {
        if (typeof value.latitude !== "number") {
          errors.push({
            valuePath: `value`,
            value: value.latitude,
            msg: "Value must be a number.",
            type: "std/latitudeFloat",
          });
        } else {
          if (value.latitude < -90) {
            errors.push({
              valuePath: `value`,
              value: value.latitude,
              msg: "Value must be greater than or equal to -90.",
              type: "std/latitudeFloat",
            });
          }

          if (value.latitude > 90) {
            errors.push({
              valuePath: `value`,
              value: value.latitude,
              msg: "Value must be less than or equal to 90.",
              type: "std/latitudeFloat",
            });
          }
        }
      }
    }

    for (const key of Object.keys(value)) {
      if (!["longitude", "latitude"].includes(key)) {
        errors.push({
          valuePath: `value`,
          value: value,
          msg: `Value must not contain unrecognised property: ${key}.`,
          type: "std/longLat",
        });
      }
    }
  }

  return errors;
}

/**
 * An array of the values of the std/MonthOfYear enum.
 */
export const stdMonthOfYearValues = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
] as const;

/**
 * A month of the year.
 */
export type StdMonthOfYear =
  typeof stdMonthOfYearValues[keyof typeof stdMonthOfYearValues];

/**
 * An array of the values of the std/YesNo enum.
 */
export const stdYesNoValues = [
  "yes",
  "no",
] as const;

/**
 * A binary choice between yes or no. This type can be used where a third option may be introduced in the future.
    In that scenario a boolean field would be limiting, but a yesNo field could be replaced by a new enum without having to migrate existing data.
 */
export type StdYesNo = typeof stdYesNoValues[keyof typeof stdYesNoValues];
