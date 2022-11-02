"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isToken = void 0;
function isToken(input) {
    // token looks like $1
    const tokenRegex = /^\$\d+$/;
    return tokenRegex.test(input);
}
exports.isToken = isToken;
//# sourceMappingURL=isToken.js.map