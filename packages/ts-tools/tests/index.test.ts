import { expect, test } from "bun:test";
import { randomString } from "index";

test("randomString", () => {
  const s = randomString();
  expect(s.length).toBe(8);
});
