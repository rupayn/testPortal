import { vi } from "vitest";
import { prismaMock } from "../mocks/prisma";

vi.mock("@repo/db/config", () => ({
  prismaSingleton: prismaMock,
}));
