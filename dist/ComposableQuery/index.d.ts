import { FlatQuery, ComposableQueryParam } from "./types";
export declare class ComposableQuery {
    readonly sql: string;
    readonly params: ComposableQueryParam[];
    constructor(sql: string, params?: ComposableQueryParam[]);
    toFlatQuery(startingOffset?: number): FlatQuery;
    toHashCode(): number;
}
