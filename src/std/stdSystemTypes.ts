import { JsonotronTypeDef } from "../interfaces/index.ts";
import { bool } from "./boolTypes/index.ts";
import { dayOfWeek, monthOfYear, yesNo } from "./enumTypes/index.ts";
import {
  float,
  latitudeFloat,
  longitudeFloat,
  negativeFloat,
  negativeFloatOrZero,
  positiveFloat,
  positiveFloatOrZero,
} from "./floatTypes/index.ts";
import {
  integer,
  negativeInteger,
  negativeIntegerOrZero,
  positiveInteger,
  positiveIntegerOrZero,
  timestamp,
} from "./intTypes/index.ts";
import { plainObject } from "./objectTypes/index.ts";
import { longLat } from "./recordTypes/index.ts";
import { testEnum1, testRecord1 } from "./testTypes/index.ts";

export const stdSystemTypes: JsonotronTypeDef[] = [
  bool,
  float,
  dayOfWeek,
  integer,
  latitudeFloat,
  longitudeFloat,
  longLat,
  monthOfYear,
  negativeFloat,
  negativeFloatOrZero,
  negativeInteger,
  negativeIntegerOrZero,
  plainObject,
  positiveFloat,
  positiveFloatOrZero,
  positiveInteger,
  positiveIntegerOrZero,
  testEnum1,
  testRecord1,
  timestamp,
  yesNo,
];
