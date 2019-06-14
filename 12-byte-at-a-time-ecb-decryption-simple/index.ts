import { encrypt } from "./oracle.ts";

const encoder = new TextEncoder();

const plainText = "a";
const plainTextData = encoder.encode(plainText);

console.log( encrypt(plainTextData) );