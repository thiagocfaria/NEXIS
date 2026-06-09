#!/usr/bin/env node

import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = resolve(projectRoot, "node_modules/next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "build", "--webpack"], {
  cwd: projectRoot,
  env: {
    ...process.env,
    ANALYZE: "true",
  },
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});

child.on("error", (error) => {
  console.error("[analyze] Erro fatal:", error.message);
  process.exitCode = 1;
});
