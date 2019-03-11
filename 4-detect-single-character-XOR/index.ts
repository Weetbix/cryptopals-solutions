import { getBestDecryption } from "../util/singleByteXOR.ts";
import { hexToBinary } from "../util/conversion.ts";

const decoder = new TextDecoder("utf-8");
const data = Deno.readFileSync("./input.txt");
const messages = decoder.decode(data).split(`\n`);
console.log(messages.length);

const decryptedMessages = messages
  .map(hexToBinary)
  .map(getBestDecryption)
  .sort((a, b) => b.score - a.score);

console.log(decryptedMessages[0].decoded);
