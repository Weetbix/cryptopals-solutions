import { base64ToUint8Array } from "../util/conversion.ts";
import { keysizeRankings } from "../util/repeatingKeyXOR.ts";
import { chunk, tranpose } from "../util/array.ts";

const decoder = new TextDecoder("utf-8");
const base64Input = decoder.decode(Deno.readFileSync("./input.txt"));
const binaryInput = base64ToUint8Array(base64Input);

const chunked = chunk(new Uint8Array([1, 2, 3, 4, 5, 6]), 2);
console.log(chunked);
console.log(tranpose(chunked));
