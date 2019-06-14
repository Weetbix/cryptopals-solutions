import { generateRandomBytes } from "../util/aes/utils.ts"
import { base64ToUint8Array } from "../util/conversion.ts";
import { encrypt as AESEncrypt } from "../util/aes/ecb.ts";
import { flatten } from "../util/array.ts";

// One key per run
const ENCRYPTION_KEY = generateRandomBytes(16);

const secretTextBase64 = `Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK`

/**
 * An encryption oracle as specified by challenge 12:
 * 
 * it:
 * - Encrypts a plaintext under ECB
 * - Uses a static key, generated on first load
 * - appends the uknown text from challenge 12 to the plain text before encrypting
 * 
 * Essentially:
 * AES-128-ECB(plain-text-input  || unknown-string)
 */
export function encrypt(data: Uint8Array): Uint8Array {
  // Need to decode and append the text
  const dataToAppend = base64ToUint8Array(secretTextBase64);
  const newPlaintext = flatten([data, dataToAppend]);

  return AESEncrypt(ENCRYPTION_KEY, newPlaintext);
}