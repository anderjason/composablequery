import { FlatQuery, ComposableQueryParam } from "./types";
interface ComposableQueryProps {
    sql: string;
    params?: ComposableQueryParam[];
}
export declare class ComposableQuery {
    readonly sql: string;
    readonly params: ComposableQueryParam[];
    static isComposableQuery(value: any): value is ComposableQuery;
    static isEqual(a: ComposableQuery, b: ComposableQuery): boolean;
    constructor(props: ComposableQueryProps);
    toFlatQuery(startingOffset?: number): FlatQuery;
    toHashCode(): number;
}
export {};
