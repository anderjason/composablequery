export function isToken(input: string): boolean {
  // token looks like $1
  const tokenRegex = /^\$\d+$/;

  return tokenRegex.test(input);
}
