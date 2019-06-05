import pad from "../util/pkcs7/pad.ts";

const encoder = new TextEncoder();
const input = encoder.encode("YELLOW SUBMARINE");

console.log(pad(input, 20));
