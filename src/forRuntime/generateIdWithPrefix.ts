import { generateRandomHexString } from "./generateRandomHexString.ts";
import { intToUint8Array } from "./intToUint8Array.ts";

/**
 * Returns a hex-based id that consists of a prefix, a timestamp element (8 characters)
 * and a series of random characters (8 characters).
 * @param prefix A 2 to 5 character prefix.
 */
export function generateIdWithPrefix(prefix: string) {
  if (prefix.length < 2 || prefix.length > 5) {
    throw new Error(
      "The prefix of the id must be at least 2 in length.",
    );
  }

  const timeInSecondsSinceEpoch = Math.floor(Date.now() / 1000);
  const timeArray = intToUint8Array(timeInSecondsSinceEpoch);

  let dtComp = "";
  for (let i = 0; i < timeArray.length; ++i) {
    dtComp += ("0" + timeArray[i].toString(16)).slice(-2);
  }

  const hexComp = generateRandomHexString(8);

  return `${prefix}_${dtComp}${hexComp}`;
}
