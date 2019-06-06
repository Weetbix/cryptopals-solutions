import { binaryToHex } from "../util/conversion.ts";

const input = `Burning 'em, if you ain't quick and nimble
I go crazy when I hear a cymbal`;
const expected = `0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f`;

function encrypt(key: string, data: string): Uint8Array {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);

  return encoder
    .encode(data)
    .map((byte, index) => byte ^ keyData[index % key.length]);
}

const encoded = binaryToHex(encrypt("ICE", input));

console.log(encoded);
console.log(encoded === expected ? "PASS" : "FAIL");
