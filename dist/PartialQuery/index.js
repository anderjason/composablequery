"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartialQuery = void 0;
const util_1 = require("@anderjason/util");
const isToken_1 = require("./_internal/isToken");
const numberGivenToken_1 = require("./_internal/numberGivenToken");
class PartialQuery {
    constructor(sql, params = []) {
        this.sql = sql;
        this.params = params;
    }
    log() {
        const obj = this.toPortableQuery();
        console.log({
            sql: obj.sql,
            params: obj.params,
        });
    }
    toPortableQuery(startingOffset = 1) {
        const tokenRegex = /(\$\d+)/;
        const sqlParts = this.sql.split(tokenRegex);
        const tokenIndexByParam = new Map();
        const tokens = this.sql.match(/(\$\d+)/gm);
        if (tokens) {
            const tokenSet = new Set(tokens);
            if (tokenSet.size !== this.params.length) {
                throw new Error("The number of tokens does not match the number of params.");
            }
        }
        let outputSql = [];
        let outputParams = [];
        for (const sqlPart of sqlParts) {
            const offset = startingOffset + outputParams.length;
            if ((0, isToken_1.isToken)(sqlPart)) {
                const tokenNumber = (0, numberGivenToken_1.numberGivenToken)(sqlPart);
                const param = this.params[tokenNumber - 1];
                if (param instanceof PartialQuery) {
                    const flattenedQuery = param.toPortableQuery(offset);
                    outputSql.push(flattenedQuery.sql);
                    outputParams = outputParams.concat(flattenedQuery.params);
                }
                else {
                    if (tokenIndexByParam.has(param)) {
                        const existingTokenIndex = tokenIndexByParam.get(param);
                        outputSql.push(`$${existingTokenIndex}`);
                    }
                    else {
                        outputSql.push(`$${offset}`);
                        outputParams.push(param);
                        tokenIndexByParam.set(param, offset);
                    }
                }
            }
            else {
                outputSql.push(sqlPart);
            }
        }
        return {
            sql: outputSql.join(""),
            params: outputParams,
        };
    }
    toHashCode() {
        const portableQuery = this.toPortableQuery();
        const str = `${portableQuery.sql},${JSON.stringify(portableQuery.params)}`;
        return util_1.StringUtil.hashCodeGivenString(str);
    }
}
exports.PartialQuery = PartialQuery;
//# sourceMappingURL=index.js.map