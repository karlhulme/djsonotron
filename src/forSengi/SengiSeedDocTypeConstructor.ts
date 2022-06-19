import { SengiSeedDocTypeConstructorParameter } from "./SengiSeedDocTypeConstructorParameter.ts";

/**
 * Represents a constructor for a seed doc type.
 */
export interface SengiSeedDocTypeConstructor {
  /**
   * The name of the constructor, typically of the form 'with____'
   */
  name: string;

  /**
   * The summary that describes the constructor.
   */
  summary: string;

  /**
   * If populated, this constructor should no longer be used, and the property
   * will describe what to do instead.
   */
  deprecation?: string;

  /**
   * The fully qualified type of the parameters record object.
   */
  parameters: SengiSeedDocTypeConstructorParameter[];
}
