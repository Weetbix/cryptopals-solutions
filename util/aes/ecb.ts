import { ECB } from "https://www.unpkg.com/aes-es@3.0.0/dist/index.esm.js";
import { chunk, flatten, equal } from "../array.ts";

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
