import { execSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const run = (command) => {
  execSync(command, {
    stdio: "inherit",
  });
};

try {
  console.log("Running checks...\n");

  run("pnpm check");

  console.log("\nAll checks passed.");

  const rl = createInterface({ input, output });

  const message = await rl.question("Commit message: ");

  rl.close();

  if (!message.trim()) {
    console.error("Commit message cannot be empty.");
    process.exit(1);
  }

  console.log("\nStaging changes...");
  run("git add .");

  console.log("\nCommitting...");
  run(`git commit -m "${message.replace(/"/g, '\\"')}"`);

  console.log("\nPushing...");
  run("git push");

  console.log("\n✓ Successfully committed and pushed.");
} catch {
  console.error("\n✗ Operation failed.");
  process.exit(1);
}
