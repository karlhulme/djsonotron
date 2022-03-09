/**
 * Represents an item within an enumeration definition.
 */
export interface EnumTypeDefItem {
  /**
   * The underlying value of the item.
   */
  value: string;

  /**
   * If populated, this value explains why the value was deprecated
   * and/or which item to use instead.
   */
  deprecated?: string;

  /**
   * The documentation associated with this item.
   */
  summary?: string;
}
