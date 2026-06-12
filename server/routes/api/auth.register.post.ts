import { defineHandler } from "nitro";
import { readBody, createError } from "nitro/h3";
import { hash } from "bcryptjs";
import { addUser, findUser } from "../../utils/users";

export default defineHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event);

  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  if (findUser(body.email)) {
    throw createError({
      statusCode: 409,
      statusMessage: "User already exists",
    });
  }

  const passwordHash = await hash(body.password, 10);

  addUser({
    email: body.email,
    passwordHash,
  });

  return { ok: true };
});