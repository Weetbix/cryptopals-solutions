import { ECB } from "https://www.unpkg.com/aes-es@3.0.0/dist/index.esm.js";
import pad from "../pkcs7/pad.ts";
import { chunk, flatten } from "../array.ts";

// In AES the block size is always 16 bytes / 128 bits
// regardless of the key size
const BLOCK_SIZE = 16;

/**
 * In CBC mode each cipher block is added to the next plaintext block
 * before the next call to the cipher core.
 */
export function encrypt(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array
): Uint8Array {
  if (data.length % BLOCK_SIZE !== 0) {
    // Dont bother with padding yet
    throw new Error("Key length should fit data length perfectly");
  }
  if (iv.length !== BLOCK_SIZE) {
    throw new Error("Block and IV size must match");
  }

  const aesEcb = new ECB(key);
  const blocks = chunk(data, BLOCK_SIZE);

  // For AES if the original length of the data is a multiple of
  // the block size (ie. mod = 0) then we must append a final, new
  // block of padding only to the end of the data.
  // This is so that the decryption algorithn can determine if the
  // last byte of the last block is a padding byte or part of the
  // data.
  //   if (data.length % BLOCK_SIZE === 0) {
  //     blocks.push(pad(new Uint8Array(), BLOCK_SIZE));
  //   }

  let previousBlock = iv;
  return flatten(
    blocks.map(block => {
      // In CBC each previous block is XORd to the next block
      // before encrypting
      const xordBlock = block.map((byte, i) => byte ^ previousBlock[i]);
      const encryptedBlock = new Uint8Array(BLOCK_SIZE);
      aesEcb.encrypt(xordBlock, encryptedBlock);
      previousBlock = encryptedBlock;
      return encryptedBlock;
    })
  );
}

export function decrypt(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array
): Uint8Array {
  if (data.length % BLOCK_SIZE !== 0) {
    // Dont bother with padding yet
    throw new Error("Key length should fit data length perfectly");
  }
  if (iv.length !== BLOCK_SIZE) {
    throw new Error("Block and IV size must match");
  }

  const aesEcb = new ECB(key);
  const blocks = chunk(data, BLOCK_SIZE);

  //   if (data.length % BLOCK_SIZE === 0) {
  //     blocks.push(pad(new Uint8Array(), BLOCK_SIZE));
  //   }

  // To decrypt we must to the reverse of encryption:
  // - Decrypt the block
  // - XOR it against the previous ENCRYPTED block
  let previousBlock = iv;
  return flatten(
    blocks.map(block => {
      const xoredBlock = new Uint8Array(BLOCK_SIZE);
      aesEcb.decrypt(block, xoredBlock);

      const decrypted = xoredBlock.map((byte, i) => byte ^ previousBlock[i]);

      previousBlock = block;
      return decrypted;
    })
  );
}
