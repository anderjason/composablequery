<h1 align="center">PartialQuery</h1>

<div align="center">
  <strong>Composable SQL</strong>
</div>
<div align="center">
  A lightweight library for composing parameterized SQL queries from multiple parts.
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
</div>

<div align="center">
  <sub>Built with ❤︎ by
  <a href="https://twitter.com/anderjason1">Jason Anderson</a> and
  <a href="https://github.com/choojs/choo/graphs/contributors">
    contributors
  </a>
</div>

<img src="docs/images/partialquery.jpg?raw=true" alt="Project image" />

## Table of Contents

- [Example](#example)
- [Installation](#installation)

## Example

```typescript
import { PartialQuery } from "@anderjason/partialquery";

const condition = new PartialQuery({
  sql: `state = $1 AND type = $2`
  params: ['CA', 'store']
});

const selectQuery = new PartialQuery({
  sql: `SELECT * FROM locations WHERE $1 AND is_deleted = $2`
  params: [condition, false]
});

const fullQuery = selectQuery.toPortableQuery();
```

The `fullQuery` value in the example above is:

```typescript
{
  sql: "SELECT * FROM locations WHERE state = $1 AND type = $2 AND is_deleted = $3",
  params: ['CA', 'store', false]
}
```

### Tokens

Tokens can be added to a query to be replaced by parameters later. For example, the token `$1` represents the first value in the parameters array. `$2` represents the second value, and so on.

In the example below, when the query is executed in the database engine, the token `$1` will be  
replaced with `active`, and the token `$2` will be replaced with `company123`.

```typescript
import { PartialQuery } from "@anderjason/partialquery";

const query = new PartialQuery({
  sql: `SELECT * FROM people WHERE status = $1 AND company_id = $2`
  params: ['active', 'company123']
});
```

The query text and parameters are always kept separate, so they can be passed to the database engine separately. This is helpful for preventing SQL injection attacks.

You can reuse the same token multiple times in the same query. For example, the following query uses the token `$1` twice:

```typescript
const query = new PartialQuery({
  sql: `SELECT * FROM locations WHERE city = $1 OR display_name = $1`
  params: ['San Francisco']
});
```

The number of unique tokens in a query must match the number of parameters. For example, the following query is invalid because it has two tokens `$1` and `$2` but only one parameter:

```typescript
const query = new PartialQuery({
  sql: `SELECT * FROM locations WHERE city = $1 OR display_name = $2`
  params: ['San Francisco']
});
```

### Supported parameter types

The following parameter types are supported:

- `string`
- `string[]`
- `number`
- `number[]`
- `boolean`
- `PartialQuery` (see [Composition](#composition) section)

### Composition

PartialQuery queries can be composed together to create more complex queries.

In the example below, `selectQuery` includes a nested partial query `condition`:

```typescript
import { PartialQuery } from "@anderjason/partialquery";

// this is only part of a SQL query,
// intended to be embedded inside another one
const condition = new PartialQuery({
  sql: `state = $1 AND type = $2`
  params: ['CA', 'store']
});

// this is the root query that is meant to
// be sent to the database engine
const selectQuery = new PartialQuery({
  sql: `SELECT * FROM locations WHERE $1 AND is_deleted = $2`
  params: [condition, false]
});
```

The `condition` query represents only part of a full SQL statement. It can be embedded into the middle of other queries as a parameter. To do this, the selectQuery SQL statement has a token `$1` in it, and the `condition` query is passed as the first parameter.

Queries can be nested any number of levels deep.

Nested queries like this can be flattened into a single SQL string and a single parameter list using the `toPortableQuery` function on the root query:

```typescript
selectQuery.toPortableQuery();
```

This returns the following object, with values that are ready to be sent to a database engine:

```typescript
{
  sql: "SELECT * FROM locations WHERE state = $1 AND type = $2 AND is_deleted = $3",
  params: ['CA', 'store', false]
}
```

To keep this library small and reusable, it's up to the user to decide how to execute the query. For example, you could use the [pg](https://www.npmjs.com/package/pg) library to execute the query:

```typescript
import { PartialQuery } from "@anderjason/partialquery";
import { Pool } from "pg";

const pool = new Pool();

const condition = new PartialQuery({
  sql: `state = $1 AND type = $2`
  params: ['CA', 'store']
});

const selectQuery = new PartialQuery({
  sql: `SELECT * FROM locations WHERE $1 AND is_deleted = $2`
  params: [condition, false]
});

const fullQuery = selectQuery.toPortableQuery();

pool.query(fullQuery.sql, fullQuery.params, (err, res) => {
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
$ npm install @anderjason/partialquery
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
