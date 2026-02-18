import { defineConfig } from "drizzle-kit";

import { envSchema } from "./app/lib/validators";

const env = envSchema.safeParse(process.env);

if (!env.success) {
  throw new Error(`Invalid environment variables: ${env.error.message}`);
}

export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.data.DATABASE_URL,
  },
});
