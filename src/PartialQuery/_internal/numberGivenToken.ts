import { isToken } from "./isToken";

/* Given a token like $2, returns a number like 2
 *
 * @params input A token like $1 or $2
 * @returns A number like 1 or 2
 */
export function numberGivenToken(token: string): number {
  if (!isToken(token)) {
    throw new Error(`${token} is not a token`);
  }

  const number = parseInt(token.substring(1), 10);
  return number;
}
