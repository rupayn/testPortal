import type { Request } from "express";

export function getClientIp(req: Request): string | null {
  const cfConnectingIp = req.get("cf-connecting-ip");
  const realIp = req.get("x-real-ip");
  const forwardedFor = req.get("x-forwarded-for");

  if (cfConnectingIp !== "" && cfConnectingIp !== undefined) {
    return cfConnectingIp.trim();
  }

  if (realIp !== undefined && realIp !== "") {
    return realIp.trim();
  }

  if (forwardedFor !== undefined && forwardedFor !== "") {
    const firstIp = forwardedFor.split(",")[0];

    if (firstIp !== undefined && firstIp !== "") {
      return firstIp.trim();
    }
  }

  return req.socket.remoteAddress ?? null;
}
