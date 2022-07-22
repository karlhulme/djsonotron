import { SengiDocType } from "./SengiDocType.ts";

export const dbPatch: SengiDocType = {
  name: "patch",
  pluralName: "patches",
  summary: `A patch to a document.`,
  properties: [
    {
      name: "patchedDocId",
      summary: "The id of the document that was patched.",
      propertyType: "std/shortString",
      isRequired: true,
    },
    {
      name: "patchedDocType",
      summary: "The name of the doc type that was patched.",
      propertyType: "std/mediumString",
      isRequired: true,
    },
    {
      name: "patch",
      summary: "The patch that was applied to a document.",
      propertyType: "std/plainObject",
      isRequired: true,
    },
  ],
};
