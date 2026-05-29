import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Prisma 7 does not pre-load .env before evaluating prisma.config.ts,
// so we load it explicitly here for migrate / studio commands.
dotenv.config();

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
