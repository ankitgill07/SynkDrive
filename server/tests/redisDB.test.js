import assert from "node:assert/strict";
import test from "node:test";
import { ensureUserIndex } from "../db/redisDB.js";

test("creates the user session search index once when it is missing", async () => {
  let exists = false;
  let createCalls = 0;
  let createdArgs;

  const redis = {
    ft: {
      async info(indexName) {
        assert.equal(indexName, "userIdx");
        if (!exists) {
          throw new Error("SEARCH_INDEX_NOT_FOUND Index not found: userIdx");
        }
        return { indexName };
      },
      async create(...args) {
        createCalls += 1;
        createdArgs = args;
        exists = true;
      },
    },
  };

  await Promise.all(Array.from({ length: 5 }, () => ensureUserIndex(redis)));

  assert.equal(createCalls, 1);
  assert.deepEqual(createdArgs, [
    "userIdx",
    { "$.userId": { type: "TAG", AS: "userId" } },
    { ON: "JSON", PREFIX: "session:" },
  ]);
});
