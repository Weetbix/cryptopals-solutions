/**
 * Split an input array into chunks of chunkLength length
 */
export function chunk(array: Uint8Array, chunkLength: number): Uint8Array[] {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < array.length; i += chunkLength) {
    chunks.push(array.slice(i, i + chunkLength));
  }
  return chunks;
}

/**
 * Given an array of arrays, returns an array of transposed arrays.
 * That is, an array of all the first items of all the arrays, an
 * array of all the second items of all the arrays and so on
 *
 * ie. [[1,2], [3,4], [5,6]]
 * becomes:
 * [[1, 3, 5], [2, 4, 6]]
 * @param arrays
 */
export function tranpose(arrays: Uint8Array[]): Uint8Array[] {
  const transposed: Uint8Array[] = [];

  for (let i = 0; i < arrays[0].length; i++) {
    transposed.push(
      Uint8Array.from(
        arrays.reduce((acc, innerArray) => {
          acc.push(innerArray[i]);
          return acc;
        }, [])
      )
    );
  }
  return transposed;
}

/**
 * Flattens an array of uint8 arrays
 * @param arrays
 */
export function flatten(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, a) => acc + a.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  arrays.forEach((a, index) => {
    result.set(a, offset);
    offset += a.length;
  });

  return result;
}

/**
 * Determines if 2 uint8 arrays are equal
 */
export function equal(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length === right.length) {
    return left.every((val, index) => right[index] === val);
  }
  return false;
}
