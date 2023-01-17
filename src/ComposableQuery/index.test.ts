import { Test } from "@anderjason/tests";
import { ComposableQuery } from ".";

Test.define("Flatten simple", () => {
  const query = new ComposableQuery({
    sql: "SELECT * FROM users WHERE id = $1 AND name = $2",
    params: [1, "Fred"],
  });
  const actual = query.toFlatQuery();
  const expected = {
    sql: "SELECT * FROM users WHERE id = $1 AND name = $2",
    params: [1, "Fred"],
  };

  Test.assertIsEqual(actual.sql, expected.sql, "Expected SQL to be correct");
  Test.assertIsDeepEqual(
    actual.params,
    expected.params,
    "Expected params to be correct"
  );
});

Test.define("Flatten complex", () => {
  const first = new ComposableQuery({ sql: "id = $1", params: [555] });
  const second = new ComposableQuery({
    sql: "is_deleted = $1",
    params: [false],
  });
  const innerQuery = new ComposableQuery({
    sql: "($1 AND $2)",
    params: [first, second],
  });

  const query = new ComposableQuery({
    sql: "SELECT * FROM users WHERE $1 AND name = $2",
    params: [innerQuery, "John"],
  });

  Test.assert(
    innerQuery instanceof ComposableQuery,
    "innerQuery is not a Query"
  );

  const flatQuery = query.toFlatQuery();
  Test.assertIsEqual(
    flatQuery.sql,
    "SELECT * FROM users WHERE (id = $1 AND is_deleted = $2) AND name = $3",
    "SQL is not equal"
  );
  Test.assertIsDeepEqual(
    flatQuery.params,
    [555, false, "John"],
    "Params are not equal"
  );
});

Test.define("Flatten should throw if the number of params is incorrect", () => {
  const query = new ComposableQuery({
    sql: `
    INSERT INTO selection_groups (cache_key, expires_at_epoch_ms)
    VALUES $1, $2
    ON CONFLICT (cache_key) DO UPDATE
    SET expires_at_epoch_ms = $3
  `,
    params: ["cacheKey", 1234567890],
  });

  Test.assertThrows(() => {
    query.toFlatQuery();
  }, "Expected to throw");
});

Test.define("Flatten should support a token being used multiple times", () => {
  const query = new ComposableQuery({
    sql: "INSERT INTO tbl (created_at, expires_at) VALUES ($1, $2) ON CONFLICT DO UPDATE SET expires_at = $2",
    params: ["cacheKey", 1234567890],
  });

  const flatQuery = query.toFlatQuery();

  Test.assertIsEqual(
    flatQuery.sql,
    "INSERT INTO tbl (created_at, expires_at) VALUES ($1, $2) ON CONFLICT DO UPDATE SET expires_at = $3",
    "SQL is not equal"
  );

  Test.assertIsDeepEqual(
    flatQuery.params,
    ["cacheKey", 1234567890, 1234567890],
    "Params are not equal"
  );
});
