import { ComposableQuery } from ".";

export type FlatQueryParam = string | string[] | number | number[] | boolean;

export interface FlatQuery {
  sql: string;
  params: FlatQueryParam[];
}

export type ComposableQueryParam =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | ComposableQuery;
