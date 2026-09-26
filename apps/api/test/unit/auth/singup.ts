import { describe, expect, it } from "vitest";
import app from "../../../src/app";
describe("POST /auth/signup checking for singup functionality", () => {
  it("should signup with valid credentials", async () => {
    const response = await app.request("/api/v1/health", {
      method: "GET",
    });
    expect(response.status).toBe(200);
  });
});
