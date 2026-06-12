import { defineHandler } from "nitro";
import { readBody, createError } from "nitro/h3";
import { hash } from "bcryptjs";

// In-memory store for demo; replace with DB in production
let users: { email: string; passwordHash: string }[] = [];

export default defineHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event);
  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: "Email and password are required" });
  }
  const exists = users.find((u) => u.email === body.email);
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: "User already exists" });
  }
  const passwordHash = await hash(body.password, 10);
  users.push({ email: body.email, passwordHash });
  return { ok: true };
});