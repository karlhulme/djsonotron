import { EnumTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const recordStatus: EnumTypeDef = {
  kind: "enum",
  system: stdSystemName,
  name: "recordStatus",
  pluralName: "recordStatuses",
  summary: "The status of a record.",
  items: [
    { value: "active", summary: "The record is active." },
    { value: "archived", summary: "The record has been archived." },
    { value: "deleted", summary: "The record has been (soft) deleted." },
  ],
};
