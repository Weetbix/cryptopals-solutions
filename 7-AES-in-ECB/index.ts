import { base64ToUint8Array, binaryToAscii } from "../util/conversion.ts";
import { decrypt } from "../util/aes/ecb.ts";

const decoder = new TextDecoder("utf-8");
const base64Input = decoder.decode(Deno.readFileSync("./input.txt"));
const binaryInput = base64ToUint8Array(base64Input);

const key = "YELLOW SUBMARINE";
const decryptedBytes = decrypt(key, binaryInput);
console.log("Decrypted:");
console.log(binaryToAscii(decryptedBytes));
