import { describe, expect, it } from "vitest";
import app from "../../../src/app";
import { signInOutputSchema } from "@repo/schemas";
import { mockStudentUser } from "../fixtures/user";
import { prismaMock } from "../../mocks/prisma";
import { omitObjectsKeyValues } from "@repo/miscellaneous/js_utils";

// student
describe("POST /auth/signin checking for signin functionality for student", () => {
  it("should signin with valid credentials checking for 200 status", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockStudentUser);

    if (mockStudentUser.session == null) {
      throw new Error("Mock student session is missing");
    }
    prismaMock.session.update.mockResolvedValue(mockStudentUser.session);

    const response = await app.request("/api/v1/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "student1@edorg.edu",
        password: "Password@1234",
      }),
    });

    expect(response.status).toBe(200);

    const studentData = signInOutputSchema.parse(await response.json());

    expect(prismaMock.user.findUnique.mock.calls).toHaveLength(1);

    const findUniqueCall = prismaMock.user.findUnique.mock.calls[0];

    if (findUniqueCall == null) {
      throw new Error("User findUnique was not called");
    }

    expect(findUniqueCall[0]).toMatchObject({
      where: {
        email: "student1@edorg.edu",
      },
    });

    expect(studentData.message).toBe("Signin successfully");
    expect(studentData.success).toBe(true);

    const { id, email, name, email_verified, qualification, dob, gender, role, status } =
      mockStudentUser;

    expect(studentData.data.user).toMatchObject({
      id,
      email,
      name,
      email_verified,
      qualification,
      dob,
      gender,
      role,
      status,
    });

    const phoneCount = studentData.data.user.phone.length;

    expect(phoneCount).toBeGreaterThanOrEqual(1);
    expect(phoneCount).toBeLessThanOrEqual(3);
    expect(studentData.data.user.phone[0]).toMatchObject(
      omitObjectsKeyValues(mockStudentUser.phone[0], "id", "user_id")
    );

    if ("student" in studentData.data.user) {
      if (mockStudentUser.student == null) {
        throw new Error("Mock student data is missing");
      }

      expect(studentData.data.user.student).toMatchObject({
        id: mockStudentUser.student.id,
        class_id: mockStudentUser.student.class_id,
        academic_year_id: mockStudentUser.student.academic_year_id,
        roll_number: 1,
        status: "ACTIVE",
      });
    }

    expect(prismaMock.session.update.mock.calls).toHaveLength(1);

    const sessionUpdateCall = prismaMock.session.update.mock.calls[0];

    if (sessionUpdateCall == null) {
      throw new Error("Session update was not called");
    }

    expect(sessionUpdateCall[0]).toMatchObject({
      where: {
        user_id: mockStudentUser.id,
      },
    });
  });
});
