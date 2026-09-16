import { describe, expect, it } from "vitest";
import app from "../../src/app";
// student
describe("POST /auth/signin checking for signin functionality", () => {
  it("should signin with valid credentials checking for 200 status", async () => {
    const response = await app.request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test.com",
        password: "Password@1234",
      }),
    });
    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toEqual({
      success: true,
      message: "You have successfully signed in.",
      data: {},
    });
  });
});
