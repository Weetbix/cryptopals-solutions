import { hammingDistanceBytes, hammingDistance } from "./string.ts";
import { chunk, tranpose } from "./array.ts";
import { getBestDecryption } from "./singleByteXOR.ts";

export interface KeysizeHamming {
  keysize: number;
  distance: number;
}

/**
 * Returns an array of Keysize Hamming distances ranked by the smallest hamming distance.
 *
 * For each KEYSIZE, take the first KEYSIZE worth of bytes, and the second KEYSIZE worth of bytes
 * and find the edit distance between them. Normalize this result by dividing by KEYSIZE.
 * The KEYSIZE with the smallest normalized edit distance is probably the key.
 */
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
      distance: hammingDistanceBytes(first, second) / keysize
    });
  }

  return results.sort((a, b) => a.distance - b.distance);
}

export function attemptKeyGuess(data: Uint8Array): string {
  // Determine the likely key size
  const keysizeGuesses = keysizeRankings(data);
  console.log(keysizeGuesses);
  const keysize = keysizeGuesses[2].keysize;

  // split the input into KEY SIZE sized chunks
  const chunked = chunk(data, keysize);

  // Get an array of arrays where all the bytes in the array
  // are encrypted using the same single XOR key
  const byteAlignedArrays = tranpose(chunked);

  console.log(byteAlignedArrays.length);

  return byteAlignedArrays
    .map(singleByteXORData => {
      const keyByte = getBestDecryption(singleByteXORData).key;
      const keyAscii = String.fromCharCode(keyByte);
      return keyAscii;
    })
    .join("");
}
