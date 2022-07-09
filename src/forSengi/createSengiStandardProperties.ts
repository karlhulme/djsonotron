import { RecordTypeDefProperty } from "../interfaces/index.ts";

/**
 * Returns an array of record type def properties that need to be
 * defined for any record that is used to define a Sengi document.
 * @param docTypeName The name of a document type.
 */
export function createSengiStandardProperties(docTypeName: string) {
  return [
    generateDocIdProperty(),
    generateDocTypeProperty(docTypeName),
    generateDocStatusProperty(),
    generateDocOpIdsProperty(),
    generateDocVersionProperty(),
    generateDocCreatedByUserId(),
    generateDocCreatedByMillisecondsSinceEpoch(),
    generateDocLastUpdatedByUserId(),
    generateDocLastUpdatedByMillisecondsSinceEpoch(),
  ];
}

/**
 * Returns a Sengi id property definition.
 */
export function generateDocIdProperty(): RecordTypeDefProperty {
  return {
    name: "id",
    summary: "The globally unique id for the document.",
    propertyType: "std/uuid",
    isRequired: true,
  };
}

/**
 * Returns a Sengi docType property definition.
 * @param docTypeName The name of the docType to which this property
 * will be applied.  It is used as the only accepted constant value
 * of this property.
 */
export function generateDocTypeProperty(
  docTypeName: string,
): RecordTypeDefProperty {
  return {
    name: "docType",
    summary: "The name of the document type.",
    propertyType: "std/mediumString",
    constant: docTypeName,
    isRequired: true,
  };
}

/**
 * Returns a Sengi docType property definition.
 * @param docTypeName The name of the docType to which this property
 * will be applied.  It is used as the only accepted constant value
 * of this property.
 */
export function generateDocStatusProperty(): RecordTypeDefProperty {
  return {
    name: "docStatus",
    summary: "The status of the document, either active or archived.",
    propertyType: "std/shortString",
    isRequired: true,
  };
}

/**
 * Returns a Sengi docOpIds property definition.
 */
export function generateDocOpIdsProperty(): RecordTypeDefProperty {
  return {
    name: "docOpIds",
    summary: "The ids of the recently completed operations.",
    propertyType: "std/uuid",
    isArray: true,
    isRequired: true,
  };
}

/**
 * Returns a Sengi docVersion property definition.
 */
export function generateDocVersionProperty(): RecordTypeDefProperty {
  return {
    name: "docVersion",
    summary: "The unique version assigned to a document.",
    propertyType: "std/mediumString",
    isRequired: true,
  };
}

/**
 * Returns a Sengi createdByUserId property definition.
 */
export function generateDocCreatedByUserId(): RecordTypeDefProperty {
  return {
    name: "docCreatedByUserId",
    summary: "The id of the user that created the document.",
    propertyType: "std/mediumString",
    isRequired: true,
  };
}

/**
 * Returns a Sengi createdByMillisecondsSinceEpoch property definition.
 */
export function generateDocCreatedByMillisecondsSinceEpoch(): RecordTypeDefProperty {
  return {
    name: "docCreatedMillisecondsSinceEpoch",
    summary:
      "The number of milliseconds since the epoch when the document was created.",
    propertyType: "std/timestamp",
    isRequired: true,
  };
}

/**
 * Returns a Sengi lastUpdatedByUserId property definition.
 */
export function generateDocLastUpdatedByUserId(): RecordTypeDefProperty {
  return {
    name: "docLastUpdatedByUserId",
    summary: "The id of the user that last updated the document.",
    propertyType: "std/mediumString",
    isRequired: true,
  };
}

/**
 * Returns a Sengi lastUpdatedByMillisecondsSinceEpoch property definition.
 */
export function generateDocLastUpdatedByMillisecondsSinceEpoch(): RecordTypeDefProperty {
  return {
    name: "docLastUpdatedMillisecondsSinceEpoch",
    summary:
      "The number of milliseconds since the epoch when the document was last updated.",
    propertyType: "std/timestamp",
    isRequired: true,
  };
}
