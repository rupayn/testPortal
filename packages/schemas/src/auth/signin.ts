import { emailSchema, idSchema, passwordSchema, z } from "../zod.ts";

export const signInInputSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase()
    .max(254)
    .min(5)
    .meta({ examples: ["abcd@a.com"] }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(72)
    .meta({ examples: ["password"] }),
});

export const signInOutputSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});
export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
});

// export const signInSchema = z.object({
//   email: emailSchema,
//   password: z.string().min(1, { message: "Password is required" }).max(72),
// });

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
