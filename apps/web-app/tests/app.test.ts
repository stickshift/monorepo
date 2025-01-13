import { expect, test } from "bun:test";
import { randomString } from "ts-tools";

test("randomString", () => {
  const s = randomString();
  expect(s.length).toBe(8);
});
