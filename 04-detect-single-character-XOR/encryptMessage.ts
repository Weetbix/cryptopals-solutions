// Lets you encrypt an input message iwth a single byte XOR cypher
// usage: deno ./encryptMessage <key> <message>
//        deno ./encryptMessage v "better health needs vivy!"
import { stringToEncryptedHexEncodedString } from "../util/singleByteXOR.ts";

const [, key, message] = Deno.args;
console.log(stringToEncryptedHexEncodedString(key.charCodeAt(0), message));
