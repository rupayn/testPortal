import * as z from "zod";

// ────────────────────────────────
// Common / reusable primitives
// ────────────────────────────────

export const idSchema = z.uuid({ message: "Invalid ID format" });

export const emailSchema = z.email({ message: "Invalid email address" }).trim().toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(72, { message: "Password must be at most 72 characters" })
  .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain a number" });

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ────────────────────────────────
// Auth schemas
// ────────────────────────────────

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
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

// ────────────────────────────────
// Inferred types (export alongside schemas)
// ────────────────────────────────

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
