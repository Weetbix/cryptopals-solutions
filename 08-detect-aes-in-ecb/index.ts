import { hexToBinary } from "../util/conversion.ts";
import { getTotalNumberOfRepeatedBlocks } from "../util/aes/ecb.ts";

const decoder = new TextDecoder("utf-8");
const data = Deno.readFileSync("./input.txt");
const cypherTexts = decoder.decode(data).split("\n");

// The weakness of AES ECB is that each input block will produce
// the same cypher block.
// So we can detect that something is AES ECB encrypted by counting
// the number of repeating blocks.
const cypherTextsData = cypherTexts.map(cypherText => ({
  cypherText,
  repeatingBlocks: getTotalNumberOfRepeatedBlocks(hexToBinary(cypherText))
}));
cypherTextsData.sort((a, b) => b.repeatingBlocks - a.repeatingBlocks);

console.log("This cypher text is encrypted by AES ECB");
console.log(cypherTextsData[0]);
