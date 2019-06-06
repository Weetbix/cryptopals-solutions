import { encrypt } from "../util/aes/cbc.ts";
import { binaryToHex } from "../util/conversion.ts";

const clearText = "YELLOW SUBMARINEYELLOW SUBMARINE";
const encoder = new TextEncoder();

const encrypted = encrypt(
  encoder.encode("YELLOW SUBMARINE"),
  encoder.encode("YELLOW SUBMARINE"),
  encoder.encode(clearText)
);

console.log(binaryToHex(encrypted));
