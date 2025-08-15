import type { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const header = c.req.header("Authorization");
  if (!header) return c.json({ error: "Missing token" }, 401);

  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, "secret") as { userId: string };
    c.set("userId", payload.userId);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid Token" }, 401);
  }
};
