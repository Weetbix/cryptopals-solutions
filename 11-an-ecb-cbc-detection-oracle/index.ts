import { encryptRandomECBorCBC } from "../util/aes/utils.ts";

const encoder = new TextEncoder();
const input = encoder.encode("My cool test data");

console.log(encryptRandomECBorCBC(input));;