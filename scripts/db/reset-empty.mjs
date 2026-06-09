#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const databaseUrl = process.env.DATABASE_URL ?? "";
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const prismaCli = resolve(projectRoot, "node_modules/prisma/build/index.js");

if (process.env.NEXIS_EMPTY_RESET !== "1") {
  console.error("Reset vazio bloqueado: execute via npm run db:reset-empty.");
  process.exitCode = 2;
} else if (process.env.NODE_ENV === "production") {
  console.error("Reset vazio bloqueado: este comando nao roda em NODE_ENV=production.");
  process.exitCode = 2;
} else if (!databaseUrl.startsWith("file:")) {
  console.error("Reset vazio bloqueado: DATABASE_URL precisa comecar com file:.");
  process.exitCode = 2;
} else {
  const databasePath = resolveSqliteFileUrl(databaseUrl);

  if (!isInsideProject(databasePath)) {
    console.error("Reset vazio bloqueado: DATABASE_URL precisa apontar para arquivo local dentro deste projeto.");
    process.exitCode = 2;
  } else {
    console.log(`Reset vazio destrutivo local: ${databaseUrl}. Nenhum dado demo sera carregado.`);
    mkdirSync(dirname(databasePath), { recursive: true });
    removeSqliteFiles(databasePath);

    const resetResult = spawnSync(process.execPath, [prismaCli, "migrate", "deploy"], {
      cwd: projectRoot,
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
      stdio: "inherit",
    });

    if (resetResult.error) {
      console.error("Reset vazio bloqueado:", resetResult.error.message);
    }

    if (resetResult.status === 0) {
      console.log("Reset vazio local concluido.");
    }

    process.exitCode = resetResult.status ?? 1;
  }
}

function resolveSqliteFileUrl(url) {
  const path = url.slice("file:".length);

  if (path.startsWith("./")) {
    return resolve(projectRoot, path);
  }

  return resolve(path);
}

function isInsideProject(path) {
  return path === projectRoot || path.startsWith(`${projectRoot}${sep}`);
}

function removeSqliteFiles(path) {
  for (const suffix of ["", "-journal", "-shm", "-wal"]) {
    rmSync(`${path}${suffix}`, { force: true });
  }
}
