export declare type QueryParam = string | string[] | number | number[] | boolean | ComposableQuery;
export declare type FlatQueryParam = string | string[] | number | number[] | boolean;
export interface FlatQuery {
    sql: string;
    params: FlatQueryParam[];
}
export declare class ComposableQuery {
    readonly sql: string;
    readonly params: QueryParam[];
    constructor(sql: string, params?: QueryParam[]);
    toFlatQuery(startingOffset?: number): FlatQuery;
    toHashCode(): number;
}
