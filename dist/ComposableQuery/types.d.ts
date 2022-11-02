import { ComposableQuery } from ".";
export declare type FlatQueryParam = string | string[] | number | number[] | boolean;
export declare type ComposableQueryParam = FlatQueryParam | ComposableQuery;
export interface FlatQuery {
    sql: string;
    params: FlatQueryParam[];
}
