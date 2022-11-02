import { StringUtil } from "@anderjason/util";
import { FlatQuery, FlatQueryParam, ComposableQueryParam } from "./types";
import { isToken } from "./_internal/isToken";
import { numberGivenToken } from "./_internal/numberGivenToken";

interface ComposableQueryProps {
  sql: string;
  params?: ComposableQueryParam[];
}

export class ComposableQuery {
  readonly sql: string;
  readonly params: ComposableQueryParam[];

  static isComposableQuery(value: any): value is ComposableQuery {
    if (value == null) {
      return false;
    }

    if (typeof value !== "object") {
      return false;
    }

    return (
      typeof value.toFlatQuery === "function" && typeof value.sql === "string"
    );
  }

  static isEqual(a: ComposableQuery, b: ComposableQuery): boolean {
    if (a == null || b == null) {
      return false;
    }

    return a.toHashCode() === b.toHashCode();
  }

  constructor(props: ComposableQueryProps) {
    const { sql, params = [] } = props;

    this.sql = sql;
    this.params = params;
  }

  toFlatQuery(startingOffset: number = 1): FlatQuery {
    const tokenRegex = /(\$\d+)/;
    const sqlParts = this.sql.split(tokenRegex);

    const tokenIndexByParam = new Map<any, number>();

    const tokens = this.sql.match(/(\$\d+)/gm);
    if (tokens) {
      const tokenSet = new Set(tokens);

      if (tokenSet.size !== this.params.length) {
        throw new Error(
          "The number of tokens does not match the number of params."
        );
      }
    }

    let outputSql: string[] = [];
    let outputParams: FlatQueryParam[] = [];

    for (const sqlPart of sqlParts) {
      const offset = startingOffset + outputParams.length;

      if (isToken(sqlPart)) {
        const tokenNumber = numberGivenToken(sqlPart);
        const param = this.params[tokenNumber - 1];

        if (ComposableQuery.isComposableQuery(param)) {
          const flatQuery = param.toFlatQuery(offset);
          outputSql.push(flatQuery.sql);
          outputParams = outputParams.concat(flatQuery.params);
        } else {
          if (tokenIndexByParam.has(param)) {
            const existingTokenIndex = tokenIndexByParam.get(param);
            outputSql.push(`$${existingTokenIndex}`);
          } else {
            outputSql.push(`$${offset}`);
            outputParams.push(param);
            tokenIndexByParam.set(param, offset);
          }
        }
      } else {
        outputSql.push(sqlPart);
      }
    }

    return {
      sql: outputSql.join(""),
      params: outputParams,
    };
  }

  toHashCode(): number {
    const flatQuery = this.toFlatQuery();
    const str = `${flatQuery.sql},${JSON.stringify(flatQuery.params)}`;

    return StringUtil.hashCodeGivenString(str);
  }
}
