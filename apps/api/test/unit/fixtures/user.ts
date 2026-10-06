import type { SigninUserType } from "@repo/db/config";

const baseSession: SigninUserType["session"] = {
  id: "0199base3-0000-7000-8000-000000000003",
  user_id: "0199base1-0000-7000-8000-000000000001",
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
};

const baseUser: SigninUserType = {
  id: "0199base1-0000-7000-8000-000000000001",

  email: "base@edorg.edu",
  email_verified: true,
  password: "dummy-password",
  name: "Base User",

  dob: new Date("1990-01-01"),
  gender: "MALE",
  status: "ACTIVE",

  qualification: {},

  role: "USER",

  created_at: new Date("2026-09-01T10:00:00.000Z"),
  updated_at: new Date("2026-09-01T10:00:00.000Z"),

  phone: [
    {
      id: "0199base2-0000-7000-8000-000000000002",
      user_id: "0199base1-0000-7000-8000-000000000001",

      country_code: "+91",
      phone: "9000000000",

      is_primary: true,
      is_verified: true,

      type: "MOBILE",

      created_at: new Date("2026-09-01T10:00:00.000Z"),
      updated_at: new Date("2026-09-01T10:00:00.000Z"),
    },
  ],

  student: null,

  employee: null,

  session: baseSession,
};

export const mockStudentUser: SigninUserType = {
  ...baseUser,

  id: "0199a111-1111-7111-8111-111111111111",

  email: "student1@edorg.edu",
  name: "Sam Student",

  dob: new Date("2010-06-20"),

  phone: [
    {
      ...baseUser.phone[0],
      id: "0199a222-2222-7222-8222-222222222222",
      user_id: "0199a111-1111-7111-8111-111111111111",
      phone: "9000000005",
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
    ...baseSession,
    id: "0199a666-6666-7666-8666-666666666666",
    user_id: "0199a111-1111-7111-8111-111111111111",
  },
};

/**
 * ============================================================
 * TEACHER OWNER
 * ============================================================
 */

export const mockTeacherOwnerUser: SigninUserType = {
  ...baseUser,

  id: "0199b111-1111-7111-8111-111111111111",

  email: "math.teacher@edorg.edu",
  name: "Tara Mathews",

  dob: new Date("1990-02-15"),
  gender: "FEMALE",

  qualification: {
    degree: "M.Sc Mathematics",
    institution: "Springfield University",
  },

  phone: [
    {
      ...baseUser.phone[0],
      id: "0199b222-2222-7222-8222-222222222222",
      user_id: "0199b111-1111-7111-8111-111111111111",
      phone: "9000000003",
    },
  ],

  student: null,

  employee: {
    id: "0199b333-3333-7333-8333-333333333333",

    employee_code: "EMP-TCH-001",

    joining_date: new Date("2019-07-01"),

    status: "ACTIVE",

    designation: "TEACHER",

    school_id: "0199b444-4444-7444-8444-444444444444",

    user_id: "0199b111-1111-7111-8111-111111111111",

    created_at: new Date("2026-09-01T10:00:00.000Z"),
    updated_at: new Date("2026-09-01T10:00:00.000Z"),

    teacher: {
      id: "0199b555-5555-7555-8555-555555555555",

      employee_id: "0199b333-3333-7333-8333-333333333333",

      created_at: new Date("2026-09-01T10:00:00.000Z"),
      updated_at: new Date("2026-09-01T10:00:00.000Z"),
    },
  },

  session: {
    ...baseSession,
    id: "0199b666-6666-7666-8666-666666666666",
    user_id: "0199b111-1111-7111-8111-111111111111",
  },
};

/**
 * ============================================================
 * NORMAL TEACHER
 * ============================================================
 */

export const mockNormalTeacherUser: SigninUserType = {
  ...baseUser,

  id: "0199c111-1111-7111-8111-111111111111",

  email: "science.teacher@edorg.edu",
  name: "Sam Newton",

  dob: new Date("1988-11-05"),

  qualification: {
    degree: "M.Sc Physics",
    institution: "State University",
  },

  phone: [
    {
      ...baseUser.phone[0],
      id: "0199c222-2222-7222-8222-222222222222",
      user_id: "0199c111-1111-7111-8111-111111111111",
      phone: "9000000004",
    },
  ],

  student: null,

  employee: {
    id: "0199c333-3333-7333-8333-333333333333",

    employee_code: "EMP-TCH-002",

    joining_date: new Date("2021-07-01"),

    status: "ACTIVE",

    designation: "TEACHER",

    school_id: "0199b444-4444-7444-8444-444444444444",

    user_id: "0199c111-1111-7111-8111-111111111111",

    created_at: new Date("2026-09-01T10:00:00.000Z"),
    updated_at: new Date("2026-09-01T10:00:00.000Z"),

    teacher: {
      id: "0199c555-5555-7555-8555-555555555555",

      employee_id: "0199c333-3333-7333-8333-333333333333",

      created_at: new Date("2026-09-01T10:00:00.000Z"),
      updated_at: new Date("2026-09-01T10:00:00.000Z"),
    },
  },

  session: {
    ...baseSession,
    id: "0199c666-6666-7666-8666-666666666666",
    user_id: "0199c111-1111-7111-8111-111111111111",
  },
};

/**
 * ============================================================
 * PRINCIPAL
 * ============================================================
 */

export const mockPrincipalUser: SigninUserType = {
  ...baseUser,

  id: "0199d111-1111-7111-8111-111111111111",

  email: "principal@edorg.edu",
  name: "Peter Principal",

  dob: new Date("1975-09-23"),

  qualification: {
    degree: "PhD Education",
    institution: "Springfield University",
  },

  phone: [
    {
      ...baseUser.phone[0],
      id: "0199d222-2222-7222-8222-222222222222",
      user_id: "0199d111-1111-7111-8111-111111111111",
      phone: "9000000002",
    },
  ],

  student: null,

  employee: {
    id: "0199d333-3333-7333-8333-333333333333",

    employee_code: "EMP-PRIN-001",

    joining_date: new Date("2015-06-01"),

    status: "ACTIVE",

    designation: "PRINCIPAL",

    school_id: "0199b444-4444-7444-8444-444444444444",

    user_id: "0199d111-1111-7111-8111-111111111111",

    created_at: new Date("2026-09-01T10:00:00.000Z"),
    updated_at: new Date("2026-09-01T10:00:00.000Z"),

    teacher: null,
  },

  session: {
    ...baseSession,
    id: "0199d666-6666-7666-8666-666666666666",
    user_id: "0199d111-1111-7111-8111-111111111111",
  },
};
