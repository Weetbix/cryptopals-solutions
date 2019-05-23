import { binaryToAscii, binaryToHex } from "./conversion.ts";
import { scoreText } from "./string.ts";

export function decrypt(key: number, target: Uint8Array): Uint8Array {
  return target.map(targetByte => targetByte ^ key);
}

// Takes a normal string and returns a hex encoded string representation
// of the encrypted data
export function stringToEncryptedHexEncodedString(
  key: number,
  data: string
): string {
  const encoder = new TextEncoder();
  const binaryData = encoder.encode(data);
  const encryptedData = decrypt(key, binaryData);
  return binaryToHex(encryptedData);
}

export interface decryptionAttempt {
  key: number;
  decoded: string;
  score: number;
}
export function getBestDecryption(
  encryptedData: Uint8Array
): decryptionAttempt {
  // All byte values
  const keyRange = Array.from(new Array(255).keys());

  const decodeAttempts = keyRange.reduce((acc, currentKey) => {
    const decoded = binaryToAscii(decrypt(currentKey, encryptedData));

    return [
      ...acc,
      {
        key: currentKey,
        decoded,
        score: scoreText(decoded)
      }
    ];
  }, []);

  decodeAttempts.sort((a, b) => b.score - a.score);

  return decodeAttempts[0];
}
