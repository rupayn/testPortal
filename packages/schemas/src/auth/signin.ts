import { emailSchema, idSchema, passwordSchema, z } from "../zod.ts";



// ────────────────────────────────
// Sign In
// ────────────────────────────────


export const signInInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});


// Phone

export const phoneTypeSchema = z.enum(["MOBILE", "HOME", "WORK"]);


const phoneInputSchema= z.object({
  country_code: z.string().min(1, "Country code is required"),
  phone: z.string().min(1, "Phone number is required"),
  is_primary: z.boolean().default(false),
  type: phoneTypeSchema.default("MOBILE"),
});

export const phoneOutputSchema = phoneInputSchema.extend({

  is_verified: z.boolean(),

  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Base User

const baseUserOutputSchema = z.object({
  id: z.uuid({version:"v7"}),
  
  name: z.string(),
  email: emailSchema,
  email_verified: z.boolean(),

  qualification: z.unknown(),
  dob: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),

  phone:z.array(phoneOutputSchema),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED"]),
  
});

export const baseUserInputSchema=baseUserOutputSchema.omit({
  id:true,
  email_verified:true,
}).extend({
  password:passwordSchema
})

const studentUserSchema = baseUserOutputSchema.extend({
  role: z.literal("STUDENT"),
  student: z.object({
    id: z.uuid({version:"v7"}),
    class_id: z.uuid({ version: "v7" }),
    academic_year_id: z.uuid({ version: "v7" }),
    roll_number: z.int().optional(),
    status: z.enum([
      "ACTIVE",
      "GRADUATED",
      "TRANSFERRED",
      "INACTIVE",
    ]),
    // add only the fields you want to return
  }),
});

const teacherUserSchema = baseUserOutputSchema.extend({
  role: z.literal("TEACHER"),
  teacher: z.object({
    id: z.uuid({version:"v7"}),
    employee_code: z.string(),
    joining_date: z.coerce.date(),
    status: z.enum([
      "ACTIVE",
      "INACTIVE",
      "SUSPENDED",
      "TERMINATED",
    ]),
    designation: z.enum([
      "TEACHER",
      "ACCOUNTANT",
      "PRINCIPAL",
      "ADMIN",
      "CLERK",
      "LIBRARIAN",
      "OTHER",
    ]),
    school_id: z.uuid({ version: "v7" }),
    // add only the fields you want to return
  }),
});

const adminUserSchema = baseUserOutputSchema.extend({
  role: z.literal("ADMIN"),
});

export const signInOutputSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  user: z.discriminatedUnion("role", [
    studentUserSchema,
    teacherUserSchema,
    adminUserSchema,
  ]),
});
export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
});


// ────────────────────────────────
// User schemas
// ────────────────────────────────

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: emailSchema.optional(),
});

export const userIdParamSchema = z.object({
  id: idSchema,
});

export type SignInInput = z.infer<typeof signInInputSchema>;

export type SignUpInput = z.infer<typeof signUpSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type SignInOutput = z.infer<typeof signInOutputSchema>;
