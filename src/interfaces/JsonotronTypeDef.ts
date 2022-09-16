import { LabelDef } from "./LabelDef.ts";
import { JsonotronTypeKind } from "./JsonotronTypeKind.ts";

/**
 * Represents the properties that every resource definition must present.
 */
export interface JsonotronTypeDef {
  /**
   * The kind of type.
   */
  kind: JsonotronTypeKind;

  /**
   * The name of the system to which this type belongs.
   */
  system: string;

  /**
   * The name of the type, that should be unique within it's owning system.
   */
  name: string;

  /**
   * The plural name of the type, that should be unique within it's owning system.
   */
  pluralName: string;

  /**
   * Documents the usage of the type.
   */
  summary: string;

  /**
   * If populated, this value explains why the type has been deprecated
   * and/or which type to use instead.
   */
  deprecated?: string;

  /**
   * An array of arbritary tags.
   */
  tags?: string[];

  /**
   * An array of arbitrary labels.
   */
  labels?: LabelDef[];
}
