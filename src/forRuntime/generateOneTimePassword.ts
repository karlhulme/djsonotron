import { generateRandomFloat } from "./generateRandomFloat.ts";

/**
 * Generates a six digit number.
 * Numbers are easy to remember and enter on both desktop
 * and laptops.  They are also easy to send/receive and read
 * via email and text.
 */
export function generateOneTimePassword() {
  const otp = Math.floor(generateRandomFloat() * 1000000);
  return otp.toString().padStart(6, "0");
}
