import { mockDeep } from "vitest-mock-extended";
import type { PrismaClient } from "@repo/db/config";

export const prismaMock = mockDeep<PrismaClient>();
