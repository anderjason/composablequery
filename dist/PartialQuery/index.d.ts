export declare type QueryParam = string | string[] | number | number[] | boolean | PartialQuery;
export declare type PortableQueryParam = string | string[] | number | number[] | boolean;
export interface PortableQuery {
    sql: string;
    params: PortableQueryParam[];
}
export declare class PartialQuery {
    readonly sql: string;
    readonly params: QueryParam[];
    constructor(sql: string, params?: QueryParam[]);
    log(): void;
    toPortableQuery(startingOffset?: number): PortableQuery;
    toHashCode(): number;
}
