import { describe, expect, it } from "vitest";
import app from "../../../src/app";
import { signInOutputSchema } from "@repo/schemas";

// vi.mock("@repo/db/config", async (importOriginal) => {
//   const actual = await importOriginal();

//   return {
//     ...actual,
//     prismaSingleton: prismaMock,
//   };
// });
// student
describe("POST /auth/signin checking for signin functionality", () => {
  it("should signin with valid credentials checking for 200 status", async () => {
    const response = await app.request("/api/v1/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: "student1@edorg.edu",
        password: "Password@1234",
      }),
    });
    expect(response.status).toBe(200);

    const data = signInOutputSchema.parse(await response.json());

    expect(data).toEqual({
      success: true,
      message: "You have successfully signed in.",
      data: {},
    });
  });
});
