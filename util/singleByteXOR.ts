import { binaryToAscii } from "./conversion.ts";
import { scoreText } from "./string.ts";

export function decrypt(key: number, target: Uint8Array): Uint8Array {
  return target.map(targetByte => targetByte ^ key);
}

export interface decryptionAttempt {
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
        decoded,
        score: scoreText(decoded)
      }
    ];
  }, []);

  decodeAttempts.sort((a, b) => b.score - a.score);

  return decodeAttempts[0];
}
