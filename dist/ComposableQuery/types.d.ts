import { ComposableQuery } from ".";
export declare type FlatQueryParam = string | string[] | number | number[] | boolean;
export interface FlatQuery {
    sql: string;
    params: FlatQueryParam[];
}
export declare type ComposableQueryParam = string | string[] | number | number[] | boolean | ComposableQuery;
