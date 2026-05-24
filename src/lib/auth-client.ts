import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_APP_URL must be set in non-development environments");
}

export const authClient = createAuthClient({
  baseURL,
});
