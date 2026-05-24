import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./auth-schema";

const secret = process.env.BETTER_AUTH_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!secret) throw new Error("BETTER_AUTH_SECRET is required");
if (!googleClientId) throw new Error("GOOGLE_CLIENT_ID is required");
if (!googleClientSecret) throw new Error("GOOGLE_CLIENT_SECRET is required");

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), {
  schema,
});

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret,
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },
});
