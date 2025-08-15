import { Hono } from "hono";
import { db } from "../db/client.js";
import z from "zod";
import bcrypt from "bcrypt";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";

type Variables = {
  userId: string;
};

const auth = new Hono<{ Variables: Variables }>();

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(128),
});

auth.post("/register", async (c) => {
  const body = await c.req.json();
  const res = registerSchema.safeParse(body);
  if (!res.success) {
    return c.json({ error: "Invalid request data" }, 400);
  }

  const { email, password } = res.data;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({ email, password: hashed });
    return c.json({ message: "User registered successfully" }, 201);
  } catch (error) {
    return c.json({ error: "User registration failed" }, 500);
  }
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

auth.post("/login", async (c) => {
  const body = await c.req.json();
  const res = loginSchema.safeParse(body);
  if (!res.success) {
    return c.json({ error: res.error }, 400);
  }

  const { email, password } = res.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return c.json({ error: "Invalid password" }, 401);
  }

  const token = jwt.sign({ userId: user.id }, "secret", { expiresIn: "1h" });
  return c.json({ token: token }, 200);
});

auth.get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return c.json({ user });
});

export { auth as authRoutes };
