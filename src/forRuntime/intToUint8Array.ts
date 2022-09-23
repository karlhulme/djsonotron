// From https://stackoverflow.com/questions/55583037/convert-number-to-arraybuffer

/**
 * Converts the given integer to an array of UInt8s.
 * @param n An integer.
 */
export function intToUint8Array(n: number) {
  const a = [];
  a.unshift(n & 255);
  while (n >= 256) {
    n = n >>> 8;
    a.unshift(n & 255);
  }
  return new Uint8Array(a);
}
