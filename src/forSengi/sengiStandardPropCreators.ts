import { RecordTypeDefProperty } from "../interfaces/index.ts";

/**
 * Returns a Sengi id property definition.
 * @param isRequired True if the property is to be marked required.
 */
export function generateIdProperty(isRequired: boolean): RecordTypeDefProperty {
  return {
    name: "id",
    summary: "The globally unique id for the document.",
    propertyType: "std/uuid",
    isRequired,
  };
}

/**
 * Returns a Sengi docType property definition.
 * @param isRequired True if the property is to be marked required.
 * @param docTypeName The name of the docType to which this property
 * will be applied.  It is used as the only accepted constant value
 * of this property.
 */
export function generateDocTypeProperty(
  isRequired: boolean,
  docTypeName: string,
): RecordTypeDefProperty {
  return {
    name: "docType",
    summary: "The name of the document type.",
    propertyType: "std/mediumString",
    constant: docTypeName,
    isRequired,
  };
}

/**
 * Returns a Sengi docOpIds property definition.
 * @param isRequired True if the property is to be marked required.
 */
export function generateDocOpIdsProperty(
  isRequired: boolean,
): RecordTypeDefProperty {
  return {
    name: "docOpIds",
    summary: "The ids of the recently completed operations.",
    propertyType: "std/uuid",
    isArray: true,
    isRequired,
  };
}

/**
 * Returns a Sengi docVersion property definition.
 * @param isRequired True if the property is to be marked required.
 */
export function generateDocVersionProperty(
  isRequired: boolean,
): RecordTypeDefProperty {
  return {
    name: "docVersion",
    summary: "The unique version assigned to a document.",
    propertyType: "std/mediumString",
    isRequired,
  };
}

/**
 * Returns a Sengi createdByUserId property definition.
 * @param isRequired True if the property is to be marked required.
 */
export function generateDocCreatedByUserId(
  isRequired: boolean,
): RecordTypeDefProperty {
  return {
    name: "docCreatedByUserId",
    summary: "The id of the user that created the document.",
    propertyType: "std/mediumString",
    isRequired,
  };
}

/**
 * Returns a Sengi createdByMillisecondsSinceEpoch property definition.
 * @param isRequired True if the property is to be marked required.
 */
export function generateDocCreatedByMillisecondsSinceEpoch(
  isRequired: boolean,
): RecordTypeDefProperty {
  return {
    name: "docCreatedMillisecondsSinceEpoch",
    summary:
      "The number of milliseconds since the epoch when the document was created.",
    propertyType: "std/timestamp",
    isRequired,
  };
}

/**
 * Returns a Sengi lastUpdatedByUserId property definition.
 * @param isRequired True if the property is to be marked required.
 */
export function generateDocLastUpdatedByUserId(
  isRequired: boolean,
): RecordTypeDefProperty {
  return {
    name: "docLastUpdatedByUserId",
    summary: "The id of the user that last updated the document.",
    propertyType: "std/mediumString",
    isRequired,
  };
}

/**
 * Returns a Sengi lastUpdatedByMillisecondsSinceEpoch property definition.
 * @param isRequired True if the property is to be marked required.
 */
export function generateDocLastUpdatedByMillisecondsSinceEpoch(
  isRequired: boolean,
): RecordTypeDefProperty {
  return {
    name: "docLastUpdatedMillisecondsSinceEpoch",
    summary:
      "The number of milliseconds since the epoch when the document was last updated.",
    propertyType: "std/timestamp",
    isRequired,
  };
}
