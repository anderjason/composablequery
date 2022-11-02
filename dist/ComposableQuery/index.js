"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposableQuery = void 0;
const util_1 = require("@anderjason/util");
const isToken_1 = require("./_internal/isToken");
const numberGivenToken_1 = require("./_internal/numberGivenToken");
class ComposableQuery {
    constructor(props) {
        const { sql, params = [] } = props;
        this.sql = sql;
        this.params = params;
    }
    static isComposableQuery(value) {
        if (value == null) {
            return false;
        }
        if (typeof value !== "object") {
            return false;
        }
        return (typeof value.toFlatQuery === "function" && typeof value.sql === "string");
    }
    static isEqual(a, b) {
        if (a == null || b == null) {
            return false;
        }
        return a.toHashCode() === b.toHashCode();
    }
    toFlatQuery(startingOffset = 1) {
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
                if (ComposableQuery.isComposableQuery(param)) {
                    const flatQuery = param.toFlatQuery(offset);
                    outputSql.push(flatQuery.sql);
                    outputParams = outputParams.concat(flatQuery.params);
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
        const flatQuery = this.toFlatQuery();
        const str = `${flatQuery.sql},${JSON.stringify(flatQuery.params)}`;
        return util_1.StringUtil.hashCodeGivenString(str);
    }
}
exports.ComposableQuery = ComposableQuery;
//# sourceMappingURL=index.js.map