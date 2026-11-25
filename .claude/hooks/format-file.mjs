// PostToolUse hook: format and lint-fix the file Claude just edited.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

let input = "";
for await (const chunk of process.stdin) input += chunk;
const file = JSON.parse(input || "{}")?.tool_input?.file_path;
if (!file || !existsSync(file)) process.exit(0);

const run = (args) => {
  try {
    execFileSync("pnpm", ["exec", ...args], {
      stdio: "ignore",
      cwd: process.env.CLAUDE_PROJECT_DIR,
    });
  } catch {
    // Formatting is best-effort; `pnpm check` is the real gate.
  }
};
if (/\.(ts|tsx|js|mjs|cjs)$/.test(file)) run(["eslint", "--fix", file]);
if (/\.(ts|tsx|js|mjs|cjs|json|md|css|ya?ml)$/.test(file)) run(["prettier", "--write", file]);
