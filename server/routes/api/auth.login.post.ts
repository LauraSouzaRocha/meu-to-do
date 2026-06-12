import { defineHandler, useRuntimeConfig } from "nitro";
import { readBody, createError } from "nitro/h3";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUser } from "../../utils/users";

export default defineHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event);

  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  const user = findUser(body.email);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  const valid = await compare(body.password, user.passwordHash);

  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }

  const config = useRuntimeConfig();

  const token = jwt.sign(
    { sub: user.email },
    config.JWT_SECRET || "devsecret",
    { expiresIn: "1h" }
  );

  return { token };
});