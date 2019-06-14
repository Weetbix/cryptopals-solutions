import { encrypt } from "./oracle.ts";
import { detectBlockSize } from "../util/aes/ecb.ts";

console.log('Block size guess for encryption oracle:');
console.log(detectBlockSize(encrypt));