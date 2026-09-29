import type { SigninUserType } from "@repo/db/config";

export const mockStudentUser: SigninUserType = {
  id: "0199a111-1111-7111-8111-111111111111",

  email: "student1@edorg.edu",
  email_verified: true,
  password: "dummy-password",
  name: "Sam Student",

  dob: new Date("2010-06-20"),
  gender: "MALE",
  status: "ACTIVE",

  qualification: {},

  role: "USER",

  created_at: new Date("2026-09-01T10:00:00.000Z"),
  updated_at: new Date("2026-09-01T10:00:00.000Z"),

  phone: [
    {
      id: "0199a222-2222-7222-8222-222222222222",
      user_id: "0199a111-1111-7111-8111-111111111111",

      country_code: "+91",
      phone: "9000000005",

      is_primary: true,
      is_verified: true,

      type: "MOBILE",

      created_at: new Date("2026-09-01T10:00:00.000Z"),
      updated_at: new Date("2026-09-01T10:00:00.000Z"),
    },
  ],

  student: {
    id: "0199a333-3333-7333-8333-333333333333",
    user_id: "0199a111-1111-7111-8111-111111111111",

    class_id: "0199a444-4444-7444-8444-444444444444",
    academic_year_id: "0199a555-5555-7555-8555-555555555555",

    roll_number: 1,
    status: "ACTIVE",

    created_at: new Date("2026-09-01T10:00:00.000Z"),
    updated_at: new Date("2026-09-01T10:00:00.000Z"),
  },

  employee: null,

  session: {
    id: "0199a666-6666-7666-8666-666666666666",
    user_id: "0199a111-1111-7111-8111-111111111111",

    device_token: "seed-device-token",
    ip_address: "127.0.0.1",
    refresh_token: "seed-refresh-token",

    user_agent: "seed-script/1.0",
    provider: "EMAIL",

    is_active: true,
    expires_at: new Date("2026-10-29T10:00:00.000Z"),

    created_at: new Date("2026-09-01T10:00:00.000Z"),
    updated_at: new Date("2026-09-01T10:00:00.000Z"),
    last_active: new Date("2026-09-01T10:00:00.000Z"),
  },
};
