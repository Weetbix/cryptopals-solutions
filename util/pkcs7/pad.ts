/**
 * PKCS#7 block padding implementation.
 *
 * The block will be padding to the given length, and the value
 * of the padded bytes will be the number of padding bytes required.
 *
 * ie: pad([ x, x, x ], 5)
 * gives: [x, x, x, 0x02, 0x02]
 *
 * @param block     Block to pad
 * @param padTo     Desired block size
 * @return          The new block padded, with length padTo
 */
export default function pad(block: Uint8Array, padTo: number): Uint8Array {
  if (block.length === padTo) return block;

  const padValue = padTo - block.length;
  const newBlock = new Uint8Array(padTo).fill(padValue);
  newBlock.set(block);

  return newBlock;
}
