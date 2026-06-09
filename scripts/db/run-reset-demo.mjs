#!/usr/bin/env node

process.env.NEXIS_DEMO_RESET = "1";
process.env.DATABASE_URL = "file:./dev.db";

await import("./reset-demo.mjs");
