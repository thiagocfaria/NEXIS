#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const demoDatabaseUrl = "file:./dev.db";
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const prismaCli = resolve(projectRoot, "node_modules/prisma/build/index.js");

if (process.env.NEXIS_DEMO_RESET !== "1") {
  console.error("Reset demo bloqueado: execute via npm run db:reset-demo.");
  process.exitCode = 2;
} else if (process.env.DATABASE_URL !== demoDatabaseUrl) {
  console.error(`Reset demo bloqueado: DATABASE_URL precisa ser ${demoDatabaseUrl}.`);
  process.exitCode = 2;
} else {
  console.log("Resetando apenas o SQLite local/demo em file:./dev.db.");

  const commandEnv = {
    ...process.env,
    DATABASE_URL: demoDatabaseUrl,
  };

  const resetResult = spawnSync(process.execPath, [prismaCli, "migrate", "reset", "--force"], {
    cwd: projectRoot,
    env: commandEnv,
    stdio: "inherit",
  });

  if (resetResult.error) {
    console.error("Reset demo bloqueado:", resetResult.error.message);
  }

  if (resetResult.status === 0) {
    const seedResult = spawnSync(process.execPath, [prismaCli, "db", "seed"], {
      cwd: projectRoot,
      env: commandEnv,
      stdio: "inherit",
    });

    if (seedResult.error) {
      console.error("Reset demo bloqueado:", seedResult.error.message);
    }

    process.exitCode = seedResult.status ?? 1;
  } else {
    process.exitCode = resetResult.status ?? 1;
  }
}
