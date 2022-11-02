"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberGivenToken = void 0;
const isToken_1 = require("./isToken");
/* Given a token like $2, returns a number like 2
 *
 * @params input A token like $1 or $2
 * @returns A number like 1 or 2
 */
function numberGivenToken(token) {
    if (!(0, isToken_1.isToken)(token)) {
        throw new Error(`${token} is not a token`);
    }
    const number = parseInt(token.substring(1), 10);
    return number;
}
exports.numberGivenToken = numberGivenToken;
//# sourceMappingURL=numberGivenToken.js.map