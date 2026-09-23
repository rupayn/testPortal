import { prismaSingleton, type SigninUserType } from "@repo/db/config";

export const getUser = async (
  reason: "signin" | "token" = "token",
  credential: string
): Promise<SigninUserType | null> => {
  const user: SigninUserType | null = await prismaSingleton.user.findUnique({
    where: reason === "signin" ? { email: credential } : { id: credential },
    include: {
      session: true,
      phone: true,
      student: true,
      employee: {
        include: {
          teacher: true,
        },
      },
    },
  });
  return user;
};
