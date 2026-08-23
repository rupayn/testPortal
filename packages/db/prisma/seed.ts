import { logger } from "@repo/logger/config";
import { prismaSingleton } from "../src/index.js";

async function main() {
  logger.info("Seeding database...");
  await prismaSingleton.user.upsert({
    where: {
      email: "abcd@a.com"
    },
    update: {
      
      name: "John Doe",
      password: "password",
    },
    create: {
      email: "abcd@a.com",
      name: "John Doe",
      password: "password",
    },
  });
  await prismaSingleton.post.upsert({
    where: {
      slug: "hello-world",
    },
    update: {
      title: "Hello world",
      content: "This is my first post",
      published: true,
      author: {
        connect: {
          email: "abcd@a.com",
        },
      },
    },
    create: {
      slug: "hello-world",
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
