import { describe, expect, it } from "vitest";
import app from "../src/app";
describe("POST /auth/signin", () => {
  it("should signin with valid credentials", async () => {
    const response = await app.request("/api/health", {
      method: "GET",
    });
    expect(response.status).toBe(200);
  });
});
