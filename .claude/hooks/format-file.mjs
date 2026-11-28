import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

let input = "";
for await (const chunk of process.stdin) input += chunk;
const file = JSON.parse(input || "{}")?.tool_input?.file_path;
if (!file || !existsSync(file)) process.exit(0);

const tryToRun = (args) => {
  try {
    execFileSync("pnpm", ["exec", ...args], {
      stdio: "ignore",
      cwd: process.env.CLAUDE_PROJECT_DIR,
    });
  } catch {
    return;
  }
};
if (/\.(ts|tsx|js|mjs|cjs)$/.test(file)) tryToRun(["eslint", "--fix", file]);
if (/\.(ts|tsx|js|mjs|cjs|json|md|css|ya?ml)$/.test(file)) tryToRun(["prettier", "--write", file]);
