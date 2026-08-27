// zod.ts
import * as z from "zod";

// ────────────────────────────────
// Common / reusable primitives
// ────────────────────────────────

export const idSchema = z.uuid({ message: "Invalid ID format" });

export const emailSchema = z
  .email({ message: "Invalid email address" })
  .trim()
  .toLowerCase()
  .max(254)
  .min(5);

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

export type PaginationInput = z.infer<typeof paginationSchema>;
export { z };
