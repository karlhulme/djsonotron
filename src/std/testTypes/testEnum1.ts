import { EnumTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const testEnum1: EnumTypeDef = {
  kind: "enum",
  system: stdSystemName,
  name: "testEnum1",
  summary: "A test enum to show deprecations.",
  deprecated: "This is not used, it's only for testing.",
  items: [
    { value: "theFirst" },
    { value: "theSecond" },
    {
      value: "theThird",
      deprecated:
        "deprecated: This third value is not used, use theSecond instead.",
    },
  ],
};
