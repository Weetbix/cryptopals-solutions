import { hammingDistanceBytes, hammingDistance } from "./string.ts";

export interface KeysizeHamming {
  keysize: number;
  distance: number;
}

// For each KEYSIZE, take the first KEYSIZE worth of bytes, and the second KEYSIZE worth of bytes
// and find the edit distance between them. Normalize this result by dividing by KEYSIZE.
// The KEYSIZE with the smallest normalized edit distance is probably the key.
export function keysizeRankings(data: Uint8Array): KeysizeHamming[] {
  const KEYSIZE_MIN_BYTES = 2;
  const KEYSIZE_MAX_BYTES = 40;

  let results = [];

  for (
    let keysize = KEYSIZE_MIN_BYTES;
    keysize <= KEYSIZE_MAX_BYTES;
    keysize++
  ) {
    const first = data.slice(0, keysize);
    const second = data.slice(keysize, keysize * 2);

    results.push({
      keysize,
      distance: hammingDistanceBytes(first, second)
    });
  }

  return results.sort((a, b) => a.distance - b.distance);
}
