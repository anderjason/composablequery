<h1 align="center">ComposableQuery</h1>

<div align="center">
  <strong>Make your own SQL building blocks</strong>
</div>
<div align="center">
  A lightweight library for composing parameterized SQL queries from nested parts.
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
</div>

<br />

<div align="center">
<img src="docs/images/composablequery.jpg?raw=true" alt="Project image" />
</div>

<br />

## Table of Contents

- [Example](#example)
- [Installation](#installation)

## Example

```typescript
import { ComposableQuery } from "@anderjason/composablequery";

const conditionPart = new ComposableQuery({
  sql: `state = $1 AND type = $2`
  params: ['California', 'Post Office']
});

const selectQuery = new ComposableQuery({
  sql: `SELECT * FROM locations WHERE $1 AND is_deleted = $2`
  params: [conditionPart, false]
});

const flatQuery = selectQuery.toFlatQuery();
```

The `flatQuery` value in the example above is set to:

```typescript
{
  sql: "SELECT * FROM locations WHERE state = $1 AND type = $2 AND is_deleted = $3",
  params: ['California', 'Post Office', false]
}
```

### Tokens

Tokens can be added to a query to be replaced by parameters later. The token `$1` represents the first value in the parameters array. `$2` represents the second value, and so on.

The query text and parameters are always kept separate, so they can be passed to the database engine separately. This is helpful for preventing SQL injection attacks.

```typescript
import { ComposableQuery } from "@anderjason/composablequery";

const query = new ComposableQuery({
  sql: `SELECT * FROM people WHERE status = $1 AND company_id = $2`
  params: ['active', 'company123']
});
```

You can reuse the same token multiple times in the same query. The following query uses the token `$1` twice:

```typescript
const query = new ComposableQuery({
  sql: `SELECT * FROM locations WHERE city = $1 OR display_name = $1`
  params: ['San Francisco']
});
```

The number of unique tokens in a query must match the number of parameters. The following query is invalid because it has two tokens `$1` and `$2` but only one parameter:

```typescript
const query = new ComposableQuery({
  sql: `SELECT * FROM locations WHERE city = $1 OR display_name = $2`
  params: ['San Francisco']
});
```

### Supported SQL

ComposableQuery doesn't parse or evaluate the SQL text, so you can use any query syntax you like. It's up to you to ensure that the SQL text is valid for the database engine you're using.

### Supported parameter types

The following parameter types are supported:

- `string`
- `string[]`
- `number`
- `number[]`
- `boolean`
- `ComposableQuery` (see [Composition](#composition) section)

### Composition

ComposableQuery objects can be composed together to create more complex queries.

In the example below, `selectQuery` includes a nested partial query `conditionPart`:

```typescript
import { ComposableQuery } from "@anderjason/composablequery";

// conditionPart is only a portion of a SQL query,
// intended to be embedded in another part
const conditionPart = new ComposableQuery({
  sql: `state = $1 AND type = $2`
  params: ['California', 'Post Office']
});

// selectQuery is the root query
const selectQuery = new ComposableQuery({
  sql: `SELECT * FROM locations WHERE $1 AND is_deleted = $2`
  params: [conditionPart, false]
});
```

The `conditionPart` object represents only part of a full SQL statement. It can be embedded into other queries as a parameter. To do this, the `selectQuery` SQL statement has a token `$1` in it, and `conditionPart` is passed as the first parameter. Queries can be nested any number of levels deep.

Nested queries (like `conditionPart`) and root queries (like `selectQuery`) are the same from a technical perspective. The only difference is that in your usage, you consider one of them the query that you plan to run.

ComposableQuery objects can be flattened into a single SQL string and a single parameter list using the `toFlatQuery` function on the root query.

```typescript
// In this example, flatQuery is set to a plain JavaScript object
// with two properties: sql and params

// The sql property is a string containing the full SQL statement
// The params property is an array of parameters

const flatQuery = selectQuery.toFlatQuery();
```

In the code above, the `toFlatQuery` method returns the following object, with values that are ready to be sent to a database engine:

```typescript
{
  sql: "SELECT * FROM locations WHERE state = $1 AND type = $2 AND is_deleted = $3",
  params: ['California', 'Post Office', false]
}
```

### Executing queries

To keep this library small and reusable, it's up to the user to decide how to execute the query. For example, you could use the [pg](https://www.npmjs.com/package/pg) library to execute the query:

```typescript
import { ComposableQuery } from "@anderjason/composablequery";
import { Pool } from "pg";

const pool = new Pool();

const condition = new ComposableQuery({
  sql: `state = $1 AND type = $2`
  params: ['California', 'Post Office']
});

const selectQuery = new ComposableQuery({
  sql: `SELECT * FROM locations WHERE $1 AND is_deleted = $2`
  params: [condition, false]
});

const flatQuery = selectQuery.toFlatObject();

pool.query(flatQuery.sql, flatQuery.params, (err, res) => {
  if (err) {
    // error
    console.log(err.stack);
  } else {
    // success
    console.log(res.rows);
  }
});
```

## Installation

```sh
$ npm install @anderjason/composablequery
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
