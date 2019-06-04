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
  // The cryptopals challenges say take the key sizes
  // from 2 to 40, but here I set the lower limit to 4.
  // Otherwise the keys with 2 and 3 bytes have a lower
  // hamming distance and are falsely ranked higher.
  // This is even after applying them "Take 4 keysize blocks
  // instead of 2 and average the distance" suggestion
  const KEYSIZE_MIN_BYTES = 4;
  const KEYSIZE_MAX_BYTES = 40;

  let results = [];

  for (
    let keysize = KEYSIZE_MIN_BYTES;
    keysize <= KEYSIZE_MAX_BYTES;
    keysize++
  ) {
    // we are going to take 4 KEY_SIZE blocks and average the hamming distance between them
    const first = data.slice(0, keysize);
    const second = data.slice(keysize, keysize * 2);
    const third = data.slice(keysize * 2, keysize * 3);
    const fourth = data.slice(keysize * 3, keysize * 4);

    const dist =
      (hammingDistanceBytes(first, second) +
        hammingDistanceBytes(second, third) +
        hammingDistanceBytes(third, fourth)) /
      3.0;

    results.push({
      keysize,
      distance: dist / keysize
    });
  }

  return results.sort((a, b) => a.distance - b.distance);
}

/**
 * Given an input which is binary data encrypted by some
 * repeating key XOR, this function returns a string that
 * is likely the key.
 *
 * @param data Binary data encrypted by repeating key XOR
 */
export function attemptKeyGuess(data: Uint8Array): string {
  // Determine the likely key size
  const keysizeGuesses = keysizeRankings(data);

  // If our keysize rankings is working correctly it should
  // be the keysize with the highest rank
  const keysize = keysizeGuesses[0].keysize;

  // split the input into KEY SIZE sized chunks
  const chunked = chunk(data, keysize);

  // Get an array of arrays where all the bytes in the array
  // are encrypted using the same single XOR key
  const byteAlignedArrays = tranpose(chunked);

  return byteAlignedArrays
    .map(singleByteXORData => {
      const keyByte = getBestDecryption(singleByteXORData).key;
      const keyAscii = String.fromCharCode(keyByte);
      return keyAscii;
    })
    .join("");
}

/**
 * Applies repeated key XOR encryption/decryption on a given data array
 */
export function encrypt(key: string, data: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);

  return data.map((byte, index) => byte ^ keyData[index % key.length]);
}
