import { EnumTypeDefItem } from "./EnumTypeDefItem.ts";
import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";

/**
 * Represents an enumeration definition.
 */
export interface EnumTypeDef extends JsonotronTypeDef {
  /**
   * An array of items that make up this enumeration.
   */
  items: EnumTypeDefItem[];
}
