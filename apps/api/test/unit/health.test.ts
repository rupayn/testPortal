import { describe, expect, it } from "vitest";
import app from "../../src/app";
import { healthResponseSchema } from "@repo/schemas";
describe("GET /api/health​ checking health", () => {
  it("should return 200 status", async () => {
    const response = await app.request("/api/v1/health", {
      method: "GET",
    });
    const body = healthResponseSchema.parse(await response.json());
    expect(body.success).toBe(true);
    expect(body.message).toBe("Health check");
    expect(body.data.status).toBe("ok");
    expect(response.status).toBe(200);
  });
});
