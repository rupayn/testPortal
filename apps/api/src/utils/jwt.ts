import { verify, sign } from "hono/jwt";
import { envs } from "../config/dotenv";

export const signAccessToken = async (userId: string, sessionId: string) => {
  const payload = {
    sub: userId,
    sessionId,
    type: "access" as const,
  };

  return sign(payload, envs.JWT_SECRET, "HS256");
};

export const verifyAccessToken = async (token: string) => {
  return verify(token, envs.JWT_SECRET, "HS256");
};
