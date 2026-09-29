import { describe, expect, it } from "vitest";
import app from "../../../src/app";
import { signInOutputSchema } from "@repo/schemas";
import { mockStudentUser } from "../fixtures/user";
import { prismaMock } from "../../mocks/prisma";

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
    prismaMock.user.findUnique.mockResolvedValue(mockStudentUser);
    if (mockStudentUser.session == null) {
      throw new Error("Mock student session is missing");
    }
    prismaMock.session.update.mockResolvedValue(mockStudentUser.session);
    const response = await app.request("/api/v1/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: "student1@edorg.edu",
        password: "Password@1234",
      }),
    });
    expect(response.status).toBe(200);

    const data = signInOutputSchema.parse(await response.json());
    expect(data.message).toBe("Signin successfully");
    expect(data.success).toBe(true);
    expect(data.data.user).toMatchObject({
      id: mockStudentUser.id,

      email: "student1@edorg.edu",

      name: "Sam Student",

      email_verified: true,

      qualification: {},

      dob: new Date("2010-06-20"),

      gender: "MALE",

      role: "USER",

      status: "ACTIVE",
    });
    expect(data.data.user.phone).toHaveLength(1);
  });
});
