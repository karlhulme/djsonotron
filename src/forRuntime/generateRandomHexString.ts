/**
 * Generate a random string of the given length.
 * @param length The length of the string.  Only even numbers
 * are supported.
 */
export function generateRandomHexString(length: number) {
  if (length % 2 == 1) {
    throw new Error("Only even sizes are supported.");
  }

  const buf = new Uint8Array(length / 2);
  crypto.getRandomValues(buf);

  let result = "";

  for (let i = 0; i < buf.length; ++i) {
    result += ("0" + buf[i].toString(16)).slice(-2);
  }

  return result;
}
