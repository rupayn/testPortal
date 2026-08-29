import { execSync } from "node:child_process";
import { select, input as textInput } from "@inquirer/prompts";

const run = (command) => {
  execSync(command, {
    stdio: "inherit",
  });
};

const CHECK_CHOICES = [
  { name: "All (api + web)", value: "pnpm check-api && pnpm check-web" },
  { name: "API only", value: "pnpm check-api" },
  { name: "Web only", value: "pnpm check-web" },
  { name: "Skip checks", value: null },
];

async function askYesNo(message) {
  while (true) {
    const answer = await textInput({ message: `${message} (Y/n)` });
    const normalized = answer.trim().toLowerCase();

    if (normalized === "" || normalized === "y") {
      return true;
    }
    if (normalized === "n") {
      return false;
    }

    console.log('\nInvalid input. Please enter only "y" or "n".\n');
  }
}

async function selectCheckChoice() {
  while (true) {
    const checkChoice = await select({
      message: "Which checks do you want to run?",
      choices: CHECK_CHOICES,
    });

    const label = CHECK_CHOICES.find((c) => c.value === checkChoice)?.name;

    const confirmed = await askYesNo(`You selected "${label}". Is this correct?`);

    if (confirmed) {
      return checkChoice;
    }

    console.log("\nLet's try again.\n");
  }
}

try {
  const checkChoice = await selectCheckChoice();

  if (checkChoice) {
    console.log(`\nRunning: ${checkChoice}\n`);
    run(checkChoice);
    console.log("\nAll checks passed.");
  } else {
    console.log("\nSkipping checks.");
  }

  const message = await textInput({ message: "Commit message:" });

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
} catch (err) {
  // @inquirer/prompts throws a specific error when user hits Ctrl+C
  if (err?.name === "ExitPromptError") {
    console.log("\nCancelled.");
    process.exit(0);
  }
  console.error("\n✗ Operation failed.");
  process.exit(1);
}
