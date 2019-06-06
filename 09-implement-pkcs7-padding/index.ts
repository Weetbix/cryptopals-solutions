import { pad } from "../util/pkcs7/padding.ts";

const encoder = new TextEncoder();
const input = encoder.encode("YELLOW SUBMARINE");

console.log(pad(input, 20));
