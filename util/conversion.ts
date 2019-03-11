export function binaryToAscii(binary: Uint8Array): string {
  return new TextDecoder("utf-8").decode(binary);
}

export function hexToBinary(hex: string) {
  const buffer = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return buffer;
}
