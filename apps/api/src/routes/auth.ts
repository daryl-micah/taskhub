import { Hono } from "hono";
import { db } from "../db/client.js";
import z from "zod";
import bcrypt from "bcrypt";
import { users } from "../db/schema.js";

const auth = new Hono();

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(128),
});

auth.post("/register", async (c) => {
  const body = await c.req.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: "Invalid request data" }, 400);
  }

  const { email, password } = result.data;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({ email, password: hashed });
    return c.json({ message: "User registered successfully" }, 201);
  } catch (error) {
    return c.json({ error: "User registration failed" }, 500);
  }
});
