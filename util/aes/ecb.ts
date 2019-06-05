import { ECB } from "https://www.unpkg.com/aes-es@3.0.0/dist/index.esm.js";
import { chunk, flatten } from "../array.ts";

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
