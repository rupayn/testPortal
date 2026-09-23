import { sign, verify } from "hono/jwt";

type TokenType = "access" | "refresh";
type ExpiresIn = "15m" | "7d";

const EXPIRATION_TIME: Record<ExpiresIn, number> = {
  "15m": 15 * 60,
  "7d": 7 * 24 * 60 * 60,
};

export const signToken = async (
  userId: string,
  sessionId: string,
  secret: string,
  type: TokenType,
  expiresIn: ExpiresIn
) => {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: userId,
    sessionId,
    type,
    iat: now,
    exp: now + EXPIRATION_TIME[expiresIn],
  };

  return sign(payload, secret, "HS256");
};

export const verifyJwtToken = async (token: string, secret: string) => {
  return verify(token, secret, "HS256");
};
