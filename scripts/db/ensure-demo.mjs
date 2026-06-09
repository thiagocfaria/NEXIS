#!/usr/bin/env node
// Startup seguro para Railway: aplica migrations e carrega seed somente se vazio.
// Nunca destrói dados existentes.

import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, ProductUnit, StockMovementType, ExpenseCategory } from "@prisma/client";
import {
  demoProducts,
  demoPurchases,
  demoSales,
  demoExpenses,
  createDemoTimestamp,
} from "../../prisma/demo-seed-data.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const prismaCli = resolve(projectRoot, "node_modules/prisma/build/index.js");

function resolveDbDir(url) {
  const filePath = url.slice("file:".length);
  const resolved =
    filePath.startsWith("./") || filePath.startsWith("../")
      ? resolve(projectRoot, filePath)
      : resolve(filePath);
  return dirname(resolved);
}

async function main() {
  if (!databaseUrl.startsWith("file:")) {
    console.error("[ensure-demo] DATABASE_URL deve comecar com file:");
    process.exitCode = 1;
    return;
  }

  const dbDir = resolveDbDir(databaseUrl);
  mkdirSync(dbDir, { recursive: true });
  console.log(`[ensure-demo] Banco: ${databaseUrl}`);

  console.log("[ensure-demo] Aplicando migrations (migrate deploy)...");
  const migrateResult = spawnSync(process.execPath, [prismaCli, "migrate", "deploy"], {
    cwd: projectRoot,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });

  if (migrateResult.error) {
    console.error("[ensure-demo] Erro ao executar prisma migrate:", migrateResult.error.message);
  }

  if (migrateResult.status !== 0) {
    console.error("[ensure-demo] Migrations falharam.");
    process.exitCode = migrateResult.status ?? 1;
    return;
  }

  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    const productCount = await prisma.product.count();

    if (productCount > 0) {
      console.log(`[ensure-demo] Banco ja tem ${productCount} produto(s). Seed ignorado.`);
      return;
    }

    console.log("[ensure-demo] Banco vazio - carregando dados ficticios de demonstracao...");
    await seedDemoData(prisma);
    console.log(
      `[ensure-demo] Seed concluida: ${demoProducts.length} produtos, ` +
        `${demoPurchases.length} compras, ${demoSales.length} vendas, ` +
        `${demoExpenses.length} despesas.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function seedDemoData(prisma) {
  const seedNow = new Date();
  const ts = (minutesAgo) => createDemoTimestamp(seedNow, minutesAgo);
  const productsByKey = new Map();

  for (const p of demoProducts) {
    const created = await prisma.product.create({
      data: {
        name: p.name,
        normalizedName: normalizeProductName(p.name),
        category: p.category,
        unit: ProductUnit[p.unit],
        unitCostCents: p.unitCostCents,
        salePriceCents: p.salePriceCents,
        currentStock: String(p.currentStock),
        minimumStock: String(p.minimumStock),
        active: p.active,
      },
    });
    productsByKey.set(p.key, created);
  }

  for (const pur of demoPurchases) {
    const product = requireProduct(productsByKey, pur.productKey);
    const created = await prisma.purchase.create({
      data: {
        productId: product.id,
        quantity: String(pur.quantity),
        unitCostCents: pur.unitCostCents,
        totalCostCents: pur.totalCostCents,
        supplier: pur.supplier,
        purchasedAt: ts(pur.minutesAgo),
      },
    });
    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: StockMovementType.PURCHASE,
        quantity: String(pur.quantity),
        reason: pur.reason,
        purchaseId: created.id,
        createdAt: created.purchasedAt,
      },
    });
  }

  for (const sale of demoSales) {
    const soldAt = ts(sale.minutesAgo);
    await prisma.sale.create({
      data: {
        totalAmountCents: sale.totalAmountCents,
        soldAt,
        items: {
          create: sale.items.map((item) => {
            const product = requireProduct(productsByKey, item.productKey);
            return {
              productId: product.id,
              quantity: String(item.quantity),
              unitPriceCents: item.unitPriceCents,
              unitCostSnapshotCents: item.unitCostSnapshotCents,
              totalAmountCents: item.totalAmountCents,
              totalCostCents: item.totalCostCents,
              stockMovements: {
                create: {
                  productId: product.id,
                  type: StockMovementType.SALE,
                  quantity: String(item.quantity),
                  reason: `Venda demo de ${product.name}`,
                  createdAt: soldAt,
                },
              },
            };
          }),
        },
      },
    });
  }

  for (const exp of demoExpenses) {
    await prisma.expense.create({
      data: {
        description: exp.description,
        category: ExpenseCategory[exp.category],
        amountCents: exp.amountCents,
        paidAt: ts(exp.minutesAgo),
        confirmed: exp.confirmed,
      },
    });
  }
}

function requireProduct(productsByKey, key) {
  const product = productsByKey.get(key);
  if (!product) throw new Error(`Produto demo nao encontrado: ${key}`);
  return product;
}

function normalizeProductName(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

main().catch((error) => {
  console.error("[ensure-demo] Erro fatal:", error.message);
  process.exitCode = 1;
});
