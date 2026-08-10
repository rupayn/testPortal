import { logger } from "@repo/logger/config";
import { prismaSingleton } from "../src/index.js";

async function main() {
  logger.info("Seeding database...");
  await prismaSingleton.user.create({
    data: {
      email: "abcd@a.com",
      name: "John Doe",
      password: "password",
    },
  });
  await prismaSingleton.post.create({
    data: {
      title: "Hello world",
      content: "This is my first post",
      published: true,
      author: {
        connect: {
          email: "abcd@a.com",
        },
      },
    },
  });
  logger.info("Database seeded!");
}

main()
  .catch((e: unknown) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => {
    void prismaSingleton.$disconnect();
  });
