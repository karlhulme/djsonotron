import { EnumTypeDef } from "./EnumTypeDef.ts";
import { FloatTypeDef } from "./FloatTypeDef.ts";
import { IntTypeDef } from "./IntTypeDef.ts";
import { JsonotronTypeDef } from "./JsonotronTypeDef.ts";
import { RecordTypeDef } from "./RecordTypeDef.ts";
import { StringTypeDef } from "./StringTypeDef.ts";

/**
 * The result of parsing a set of resources.
 * A type library may contain type definitions from multiple type systems.
 */
export interface TypeLibraryDef<TypeNames extends string> {
  /**
   * An array of verified bool type definitions.
   */
  boolTypeDefs: JsonotronTypeDef[];

  /**
   * An array of verified enum type definitions.
   */
  enumTypeDefs: EnumTypeDef[];

  /**
   * An array of verified float type definitions.
   */
  floatTypeDefs: FloatTypeDef[];

  /**
   * An array of verified int type definitions.
   */
  intTypeDefs: IntTypeDef[];

  /**
   * An array of verified object type definitions.
   */
  objectTypeDefs: JsonotronTypeDef[];

  /**
   * An array of verified record type definitions.
   */
  recordTypeDefs: RecordTypeDef<TypeNames>[];

  /**
   * An array of verified string type definitions.
   */
  stringTypeDefs: StringTypeDef[];
}
