/**
 * Describes a property of a record type definition
 */
export interface RecordTypeDefProperty<JsonotronTypeNames extends string> {
  /**
   * The name of the property.
   */
  name: string;

  /**
   * A description of how this property is to be used.
   */
  summary: string;

  /**
   * The type of the property.
   */
  propertyType: JsonotronTypeNames;

  /**
   * The only acceptable value of the property.
   */
  constant?: string;

  /**
   * Specifies if the property is to be treated as an array.
   */
  isArray?: boolean;

  /**
   * Specifies if a value must be suppplied for this property
   * or whether it can be undefined.
   */
  isRequired?: boolean;

  /**
   * Specifies if null is a valid value for the property.
   */
  isNullable?: boolean;

  /**
   * If populated, this value explains why the property was deprecated
   * and/or which property to use instead.
   */
  deprecated?: string;
}
