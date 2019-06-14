import { ECB } from "https://www.unpkg.com/aes-es@3.0.0/dist/index.esm.js";
import { chunk, flatten, equal } from "../array.ts";
import { pad } from "../pkcs7/padding.ts";

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
    throw new Error(`Key length should be 128 bits but was ${key.length} bytes`);
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
