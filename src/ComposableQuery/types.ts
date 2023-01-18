import { ComposableQuery } from ".";

export type FlatQueryParam =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | Buffer
  | null
  | undefined;

export type ComposableQueryParam = FlatQueryParam | ComposableQuery;

export interface FlatQuery {
  sql: string;
  params: FlatQueryParam[];
}
