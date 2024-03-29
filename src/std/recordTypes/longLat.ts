import { RecordTypeDef } from "../../interfaces/index.ts";
import { stdSystemName } from "../stdSystemName.ts";

export const longLat: RecordTypeDef<
  "std/longitudeFloat" | "std/latitudeFloat"
> = {
  kind: "record",
  system: stdSystemName,
  name: "longLat",
  pluralName: "longLats",
  summary:
    `A GPS co-ordinate represented as a longitudinal and latitudinal position.`,
  properties: [{
    name: "longitude",
    summary: "The longitudinal position.",
    propertyType: "std/longitudeFloat",
    isRequired: true,
  }, {
    name: "latitude",
    summary: "The latitudinal position.",
    propertyType: "std/latitudeFloat",
    isRequired: true,
  }],
  validTestCases: [{
    value: {
      longitude: 1.45764854,
      latitude: 50.43859748,
    },
    summary: "A position described using longitude and latitude.",
  }],
  invalidTestCases: [{
    value: {
      longitude: 181, // out of range
      latitude: 90,
    },
  }, {
    value: {
      longitude: 180,
      latitude: 91, // out of range
    },
  }],
};
