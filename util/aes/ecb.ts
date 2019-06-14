import { ECB } from "https://www.unpkg.com/aes-es@3.0.0/dist/index.esm.js";
import { chunk, flatten, equal } from "../array.ts";
import { pad } from "../pkcs7/padding.ts";
import { detectECBorCBC, Algorithm } from "./utils.ts";

// In AES the block size is always 16 bytes / 128 bits
// regardless of the key size
const BLOCK_SIZE = 16;

export function decrypt(key: string, data: Uint8Array): Uint8Array {
  if (data.length % key.length !== 0) {
    throw new Error("Key length should fit data length perfectly");
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);

  // Split the data into key size chunks for ECB
  const blocks = chunk(data, key.length);

  const aesEcb = new ECB(keyData);
  return flatten(
    blocks.map(block => {
      // Decrypt every block with ECB
      const decryptedBlock = new Uint8Array(keyData.length);
      aesEcb.decrypt(block, decryptedBlock);
      return decryptedBlock;
    })
  );
}

export function encrypt(key: Uint8Array, data: Uint8Array): Uint8Array {
  if (key.length !== 16) {
    throw new Error(
      `Key length should be 128 bits but was ${key.length} bytes`
    );
  }

  // Split the data into key size chunks for ECB
  const blocks = chunk(data, key.length);

  // For AES if the original length of the data is a multiple of
  // the block size (ie. mod = 0) then we must append a final, new
  // block of padding only to the end of the data.
  // This is so that the decryption algorithn can determine if the
  // last byte of the last block is a padding byte or part of the
  // data.
  if (data.length % BLOCK_SIZE === 0) {
    blocks.push(pad(new Uint8Array(), BLOCK_SIZE));
  } else {
    // Otherwise, ensure the last block is padded correctly
    const LAST_INDEX = blocks.length - 1;
    blocks[LAST_INDEX] = pad(blocks[LAST_INDEX], BLOCK_SIZE);
  }

  const aesEcb = new ECB(key);
  return flatten(
    blocks.map(block => {
      // Encrypt every block with ECB
      const encryptedBlock = new Uint8Array(key.length);
      aesEcb.encrypt(block, encryptedBlock);
      return encryptedBlock;
    })
  );
}

/**
 * ECB is weak because the same input block always results
 * in the same cypher block.
 * We can use this function to count the number of times
 * one block (of key size) repeats in a data, and we can
 * use that as a heuristic to determine if something is
 * encrypted with AES ECB
 */
export function getTotalNumberOfRepeatedBlocks(
  data: Uint8Array,
  keySize: number = 16
) {
  const blocks = chunk(data, keySize);
  return blocks.reduce((totalRepeats, block) => {
    const matches = blocks.filter(other => equal(block, other));
    return totalRepeats + matches.length - 1;
  }, 0);
}

/**
 * Detects the block size used for an AES cipher function
 *
 * As ECB block cipher always returns the same block output
 * for the same input, we can detect what the block size is
 * by continuously feeding a new block into the cipher at the
 * beginning. Then the first time we go OVER the threshold of
 * the key length, the previous block and the next block will
 * share the first portion, and the length of this portion
 * would be the key length.
 *
 * Lets imagine a 3 byte key, and we are feeding 'A'
 * 'A'      => [1, 4, 8, 8, 9, 4];
 * 'AA'     => [3, 1, 1, 8, 1, 0];
 * 'AAA'    => [8, 7, 1, 8, 0, 2];
 * 'AAAA'   => [8, 7, 1, 1, 0, 1]; BOOM, block size detected!
 *
 * Note: This function expects that the encryption funciton is
 * adding some extra data to the input, otherwise we could just
 * send 1 byte and see what it gets padded to.
 */
export function detectBlockSize(
  encryptionFn: (Uint8Array) => Uint8Array
): number {
  const MAX_BLOCK_SIZE_BYTES = 64;
  const MIN_BLOCK_SIZE = 2;
  let previousOutput = null;

  for (let i = 1; i <= MAX_BLOCK_SIZE_BYTES; i++) {
    // Create an i sized array. We can use 0 for the value, it doesnt matter
    // as long as the values are the same.
    const input = new Uint8Array(i);
    const output = encryptionFn(input);

    if (previousOutput) {
      // Find the first difference in the two encryptions
      const firstUnmatchingIndex = output.findIndex((value, index) => {
        return previousOutput[index] !== value;
      });

      if (
        firstUnmatchingIndex > MIN_BLOCK_SIZE &&
        firstUnmatchingIndex !== -1
      ) {
        // This index is our block size!
        return firstUnmatchingIndex;
      }
    }

    previousOutput = output;
  }

  return -1;
}

/**
 * Implemented as described in ex 12
 */
export function byteByByteDecryption(encryptionFn: (Uint8Array) => Uint8Array) : string | null {
  // Detect block size
  const BLOCK_SIZE = detectBlockSize(encryptionFn);

  // Detect that it's ECB, even though we know it is (see ex 12)
  // Also feed this with some repeating data.
  let repeatingInput =
    "cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and ";
  const encoder = new TextEncoder();
  const algorithm = detectECBorCBC(
    encryptionFn(encoder.encode(repeatingInput))
  );

  if(algorithm !== Algorithm.ECB) {
    return null;
  }

  console.log('got here');
  return "ok";
}