function hextob(hex: string) {
  const buffer = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return buffer;
}

function decryptSingleByte(key: number, target: Uint8Array): Uint8Array {
  return target.map(targetByte => targetByte ^ key);
}

function binaryToAscii(binary: Uint8Array): string {
  return new TextDecoder("utf-8").decode(binary);
}

function scoreText(text: string) {
  return [...text].reduce(
    (acc, char) => (/[a-zA-Z]/.test(char) ? acc + 1 : acc),
    0
  );
}

const hexEncodedInput =
  "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736";
const encrypedInputBytes = hextob(hexEncodedInput);

// All byte values
const keyRange = Array.from(new Array(255).keys());

const decodeAttempts = keyRange.reduce((acc, currentKey) => {
  const decoded = binaryToAscii(
    decryptSingleByte(currentKey, encrypedInputBytes)
  );

  return [
    ...acc,
    {
      key: currentKey,
      decoded,
      score: scoreText(decoded)
    }
  ];
}, []);

decodeAttempts.sort((a, b) => b.score - a.score);

const decoded = decodeAttempts[0];

console.log("Decoded Message: " + decoded.decoded);
console.log("Key: " + decoded.key);
console.log("Key (Ascii): " + String.fromCharCode(decoded.key));
