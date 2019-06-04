import { base64ToUint8Array, binaryToAscii } from "../util/conversion.ts";
import { attemptKeyGuess, encrypt } from "../util/repeatingKeyXOR.ts";

const decoder = new TextDecoder("utf-8");
const base64Input = decoder.decode(Deno.readFileSync("./input.txt"));
const binaryInput = base64ToUint8Array(base64Input);

const keyGuess = attemptKeyGuess(binaryInput);
console.log("Key Guess: " + keyGuess);
console.log("Decryption: ");
console.log(binaryToAscii(encrypt(keyGuess, binaryInput)));
