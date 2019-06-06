const input = "1c0111001f010100061a024b53535009181c";
const key = "686974207468652062756c6c277320657965";
const expected = "746865206b696420646f6e277420706c6179";

function hextob(hex: string) {
  const buffer = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return buffer;
}

function btohex(binary: Uint8Array) {
  let hex = "";
  for (let i = 0; i < binary.length; i++) {
    hex += Number(binary[i]).toString(16);
  }
  return hex;
}

function fixedXOR(first: Uint8Array, second: Uint8Array) {
  return first.map((byte, index) => byte ^ second[index]);
}

(async () => {
  const binary = fixedXOR(hextob(input), hextob(key));

  console.log(btohex(binary) === expected ? "PASS" : "FAIL");
})();
