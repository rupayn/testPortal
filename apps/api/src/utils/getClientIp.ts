import type { Context } from "hono";

export function getClientIp(c: Context): string | null {
  const headers = c.req.raw.headers;

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp !== null && cfConnectingIp.trim() !== "") {
    return cfConnectingIp.trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp !== null && realIp.trim() !== "") {
    return realIp.trim();
  }
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor !== null && forwardedFor.trim() !== "") {
    const firstIp = forwardedFor.split(",")[0]?.trim();

    if (firstIp !== undefined && firstIp !== "") {
      return firstIp;
    }
  }

  return null;
}
