import { EnumTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const dayOfWeek: EnumTypeDef = {
  kind: "enum",
  system: stdSystemName,
  name: "dayOfWeek",
  pluralName: "daysOfWeek",
  summary: "A day of the week.",
  items: [
    { value: "mon" },
    { value: "tue" },
    { value: "wed" },
    { value: "thu" },
    { value: "fri" },
    { value: "sat" },
    { value: "sun" },
  ],
};
