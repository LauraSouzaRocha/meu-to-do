import { defineHandler } from "nitro";
import { readBody, createError } from "nitro/h3";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { useRuntimeConfig } from "nitro";

let users: { email: string; passwordHash: string }[] = [];
// In a real app, replace with DB; here we share the same in‑memory array as register route.

export default defineHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event);
  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: "Email and password are required" });
  }
  const user = users.find((u) => u.email === body.email);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
  }
  const valid = await compare(body.password, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
  }
  const config = useRuntimeConfig();
  const token = jwt.sign({ sub: user.email }, config.JWT_SECRET || "devsecret", { expiresIn: "1h" });
  return { token };
});