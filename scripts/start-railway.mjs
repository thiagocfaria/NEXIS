#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = resolve(projectRoot, "node_modules/next/dist/bin/next");
const host = process.env.HOST ?? "0.0.0.0";
const port = process.env.PORT ?? "3000";

const ensureResult = spawnSync(process.execPath, [resolve(projectRoot, "scripts/db/ensure-demo.mjs")], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

if ((ensureResult.status ?? 1) !== 0) {
  process.exitCode = ensureResult.status ?? 1;
} else {
  const child = spawn(process.execPath, [nextBin, "start", "-H", host, "-p", port], {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });

  child.on("error", (error) => {
    console.error("[start:railway] Erro fatal:", error.message);
    process.exitCode = 1;
  });
}
