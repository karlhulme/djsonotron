import { JsonotronTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const variant: JsonotronTypeDef = {
  kind: "variant",
  system: stdSystemName,
  name: "variant",
  pluralName: "variant",
  summary: `Any string, number, boolean or JSON object.`,
};
