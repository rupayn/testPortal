import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

type LogLevel = "query" | "error" | "warn" | "info";
class myPrismaClient {
  private static instance: myPrismaClient | undefined;
  public readonly client: PrismaClient;
  private constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({
      connectionString,
    });
    const logs: LogLevel[] =
      process.env.NODE_ENV !== "production" ? ["query", "error", "warn"] : ["error"];
    this.client = new PrismaClient({ adapter, log: logs });
  }
  public static getInstance(): myPrismaClient {
    if (!myPrismaClient.instance) {
      myPrismaClient.instance = new myPrismaClient();
    }
    return myPrismaClient.instance;
  }
}

export const prismaSingleton = myPrismaClient.getInstance().client;
