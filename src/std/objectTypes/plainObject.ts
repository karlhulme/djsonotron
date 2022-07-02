import { JsonotronTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const plainObject: JsonotronTypeDef = {
  kind: "object",
  system: stdSystemName,
  name: "plainObject",
  summary:
    `Any valid JSON object.  The underlying data store may impose a limit on the
  depth of the JSON object.  You cannot store a null value.  Care should be taken
  not to supply an object of such depth or serialized size that the underlying data
  store cannot save it.  Wherever possible, define types with a specific shape
  rather than using this type.`,
};
