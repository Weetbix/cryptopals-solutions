import { base64ToUint8Array } from "../util/conversion.ts";
import { hammingDistance } from "../util/string.ts";

const decoder = new TextDecoder("utf-8");
const base64Input = decoder.decode(Deno.readFileSync("./input.txt"));
const binaryInput = base64ToUint8Array(base64Input);

console.log(binaryInput);
