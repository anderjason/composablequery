import { StringUtil } from "@anderjason/util";
import { isToken } from "./_internal/isToken";
import { numberGivenToken } from "./_internal/numberGivenToken";

export type QueryParam =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | PartialQuery;

export type PortableQueryParam =
  | string
  | string[]
  | number
  | number[]
  | boolean;

export interface PortableQuery {
  sql: string;
  params: PortableQueryParam[];
}

export class PartialQuery {
  readonly sql: string;
  readonly params: QueryParam[];

  constructor(sql: string, params: QueryParam[] = []) {
    this.sql = sql;
    this.params = params;
  }

  log(): void {
    const obj = this.toPortableQuery();

    console.log({
      sql: obj.sql,
      params: obj.params,
    });
  }

  toPortableQuery(startingOffset: number = 1): PortableQuery {
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
    let outputParams: PortableQueryParam[] = [];

    for (const sqlPart of sqlParts) {
      const offset = startingOffset + outputParams.length;

      if (isToken(sqlPart)) {
        const tokenNumber = numberGivenToken(sqlPart);
        const param = this.params[tokenNumber - 1];

        if (param instanceof PartialQuery) {
          const flattenedQuery = param.toPortableQuery(offset);
          outputSql.push(flattenedQuery.sql);
          outputParams = outputParams.concat(flattenedQuery.params);
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
    const portableQuery = this.toPortableQuery();
    const str = `${portableQuery.sql},${JSON.stringify(portableQuery.params)}`;

    return StringUtil.hashCodeGivenString(str);
  }
}
