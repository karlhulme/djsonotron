import { JsonotronTypeDef } from "../interfaces/index.ts";
import { bool } from "./boolTypes/index.ts";
import { dayOfWeek } from "./enumTypes/index.ts";

export const stdSystemTypes: JsonotronTypeDef[] = [
  bool,
  dayOfWeek,
];
