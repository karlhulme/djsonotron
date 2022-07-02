import { EnumTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const yesNo: EnumTypeDef = {
  kind: "enum",
  system: stdSystemName,
  name: "yesNo",
  summary:
    `A binary choice between yes or no. This type can be used where a third option may be introduced in the future.
    In that scenario a boolean field would be limiting, but a yesNo field could be replaced by a new enum without having to migrate existing data.`,
  items: [
    { value: "yes" },
    { value: "no" },
  ],
};
