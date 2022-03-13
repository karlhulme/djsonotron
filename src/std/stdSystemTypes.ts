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
import {
  date,
  dateTimeTz,
  dateTimeUtc,
  emailAddress,
  hugeString,
  ipv4,
  ipv6,
  longString,
  mediumString,
  shortString,
  time,
  uuid,
  webAddress,
} from "./stringTypes/index.ts";
import { testEnum1, testRecord1 } from "./testTypes/index.ts";

export const stdSystemTypes: JsonotronTypeDef[] = [
  bool,
  dayOfWeek,
  date,
  dateTimeTz,
  dateTimeUtc,
  emailAddress,
  float,
  hugeString,
  ipv4,
  ipv6,
  longString,
  integer,
  latitudeFloat,
  longitudeFloat,
  longLat,
  mediumString,
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
  shortString,
  testEnum1,
  testRecord1,
  time,
  timestamp,
  uuid,
  webAddress,
  yesNo,
];
