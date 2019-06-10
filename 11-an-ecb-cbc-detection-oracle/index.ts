import { encryptRandomECBorCBC } from "../util/aes/utils.ts";
import { detectECBorCBC, Algorithm } from "../util/aes/utils.ts";

const encoder = new TextEncoder();
const input = encoder.encode(
  "cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and cats and dogs and "
);

// Take a sample of 1000 and guess the mode
const results = new Array(1000)
  .fill(0)
  .map(() => encryptRandomECBorCBC(input))
  .map(detectECBorCBC)
  .reduce((totals, current) => {
    totals[current] = totals[current] ? totals[current] +  1 : 1;
    return totals;
  }, {});

console.log("From a sample of 1000, with a rough 50% distribution: ");
console.log("ECB Detected: " + results[Algorithm.ECB]);
console.log("CBC Detected: " + results[Algorithm.CBC])