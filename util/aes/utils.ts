import { flatten } from "../array.ts";
import { encrypt as ECBEncrypt } from "./ecb.ts";
import { encrypt as CBCEncrypt } from "./cbc.ts";

function randomInt(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function generateRandomByte(): number {
  return Math.round(Math.random() * 255);
}

export function generateRandomBytes(count: number): Uint8Array {
  return new Uint8Array(count).map(generateRandomByte);
}

/**
 * An encryption oracle as specified by the crypto pals challenges set 2/11
 *
 * it:
 * - appends 5-10 random bytes before the plaintext
 * - appends 5-10 random bytes after the plaintext
 * - chooses with a 50% chance between encrypting with ECB or CBC
 * - encryptes with a random 16 byte key (and IV if CBC)
 *
 * @param data      Plaintext input
 */
export function encryptRandomECBorCBC(data: Uint8Array): Uint8Array {
  const pre = generateRandomBytes(randomInt(5, 10));
  const post = generateRandomBytes(randomInt(5, 10));

  const newPlaintext = flatten([pre, data, post]);

  const key = generateRandomBytes(16);
  const iv = generateRandomBytes(16);

  if (Math.random() > 0.5) {
    return ECBEncrypt(key, newPlaintext);
  } else {
    return CBCEncrypt(key, iv, newPlaintext);
  }
}
