export function scoreText(text: string) {
  return [...text].reduce(
    (acc, char) => (/[a-zA-Z ]/.test(char) ? acc + 1 : acc),
    0
  );
}
