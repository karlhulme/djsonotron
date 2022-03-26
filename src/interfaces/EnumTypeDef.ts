import { EnumTypeDefItem } from "./EnumTypeDefItem.ts";
import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";

/**
 * Represents an enumeration definition.
 */
export interface EnumTypeDef extends JsonotronTypeDef {
  /**
   * Tags the type as an enum.
   */
  kind: "enum"
  /**
   * An array of items that make up this enumeration.
   */
  items: EnumTypeDefItem[];
}
