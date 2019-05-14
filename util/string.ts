export function scoreText(text: string) {
  return [...text].reduce(
    (acc, char) => (/[a-zA-Z ]/.test(char) ? acc + 1 : acc),
    0
  );
}

/**
 * Returns the number of different bits in string a vs string b
 * ie the hamming or edit distance
 */
export function hammingDistance(a: string, b: string): number {
  const encoder = new TextEncoder();
  return hammingDistanceBytes(encoder.encode(a), encoder.encode(b));
}

export function hammingDistanceBytes(a: Uint8Array, b: Uint8Array): number {
  return a.reduce((acc, current, i) => {
    // First get a variable holding all the different bits between the two
    let difference = a[i] ^ b[i];
    let bitCount = 0;
    // Iterate over bit of the difference and count the bits that are 1
    while (difference !== 0) {
      // Add the least significant bit
      bitCount += difference & 1;
      // set next as least significant bit
      difference = difference >> 1;
    }
    return acc + bitCount;
  }, 0);
}
