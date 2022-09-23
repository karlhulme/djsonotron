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
  idWithPrefix,
  ipv4,
  ipv6,
  longString,
  maxString,
  mediumString,
  mediumStringDisplayable,
  oneTimePassword,
  shortString,
  shortStringDisplayable,
  time,
  userClaim,
  userClaimsString,
  uuid,
  webAddress,
} from "./stringTypes/index.ts";

export const stdSystemTypes: JsonotronTypeDef[] = [
  bool,
  dayOfWeek,
  date,
  dateTimeTz,
  dateTimeUtc,
  emailAddress,
  float,
  hugeString,
  idWithPrefix,
  ipv4,
  ipv6,
  longString,
  integer,
  latitudeFloat,
  longitudeFloat,
  longLat,
  maxString,
  mediumString,
  mediumStringDisplayable,
  monthOfYear,
  negativeFloat,
  negativeFloatOrZero,
  negativeInteger,
  negativeIntegerOrZero,
  oneTimePassword,
  plainObject,
  positiveFloat,
  positiveFloatOrZero,
  positiveInteger,
  positiveIntegerOrZero,
  shortString,
  shortStringDisplayable,
  time,
  timestamp,
  userClaim,
  userClaimsString,
  uuid,
  webAddress,
  yesNo,
];
