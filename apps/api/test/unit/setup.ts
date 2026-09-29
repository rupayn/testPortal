import { vi } from "vitest";
import { prismaMock } from "../mocks/prisma";

vi.mock("@repo/db/config", () => ({
  prismaSingleton: prismaMock,
}));

vi.mock("@repo/miscellaneous/backend", () => ({
  verifyPassword: vi.fn().mockResolvedValue(true),
  hashPassword: vi.fn().mockResolvedValue("hashed-refresh-token"),
}));
