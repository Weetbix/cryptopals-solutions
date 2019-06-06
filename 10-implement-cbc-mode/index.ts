import { encrypt, decrypt } from "../util/aes/cbc.ts";
import { binaryToHex, binaryToAscii } from "../util/conversion.ts";

const clearText = "YELLOW SUBMARINEYELLOW SUBMARINE";
const encoder = new TextEncoder();

const encrypted = encrypt(
  encoder.encode("YELLOW SUBMARINE"),
  encoder.encode("YELLOW SUBMARINE"),
  encoder.encode(clearText)
);

const again = decrypt(
  encoder.encode("YELLOW SUBMARINE"),
  encoder.encode("YELLOW SUBMARINE"),
  encrypted
);

console.log(binaryToHex(encrypted));
console.log(binaryToAscii(again));
