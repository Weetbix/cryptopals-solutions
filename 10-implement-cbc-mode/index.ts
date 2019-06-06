import { decrypt } from "../util/aes/cbc.ts";
import { binaryToAscii, base64ToUint8Array } from "../util/conversion.ts";

const decoder = new TextDecoder("utf-8");
const data = Deno.readFileSync("./input.txt");
const cypherTexts = decoder
  .decode(data)
  .split("\n")
  .join("");
const cypherData = base64ToUint8Array(cypherTexts);

const encoder = new TextEncoder();
const plainTextData = decrypt(
  encoder.encode("YELLOW SUBMARINE"),
  new Uint8Array(16).fill(0), // IV of all 0's
  cypherData
);

console.log(binaryToAscii(plainTextData));
