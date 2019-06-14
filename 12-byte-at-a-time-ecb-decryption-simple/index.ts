import { encrypt } from "./oracle.ts";
import { byteByByteDecryption } from "../util/aes/ecb.ts";

console.log('Block size guess for encryption oracle:');
console.log(byteByByteDecryption(encrypt));