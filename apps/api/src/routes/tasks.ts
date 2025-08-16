import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import z from "zod";
import type { Variables } from "../types/api.js";
import { db } from "../db/client.js";
import { tasks } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

const task = new Hono<{ Variables: Variables }>();

task.use("*", authMiddleware);

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

task.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const res = taskSchema.safeParse(body);
  if (!res.success) return c.json({ error: res.error }, 400);

  const newTask = await db
    .insert(tasks)
    .values({ ...res.data, userId })
    .returning();
  return c.json({ task: newTask }, 201);
});

task.get("/", async (c) => {
  const userId = c.get("userId");
  const page = Number(c.req.query("page") ?? "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt))
    .limit(limit)
    .offset(offset);

  return c.json({ tasks: userTasks }, 200);
});

task.put("/:id", async (c) => {
  const userId = c.get("userId");
  const taskId = c.req.param("id");
  const body = await c.req.json();
  const res = taskSchema.safeParse(body);
  if (!res.success) return c.json({ error: res.error }, 400);

  const updated = await db
    .update(tasks)
    .set({ ...res.data, updatedAt: new Date() })
    .where(eq(tasks.id, taskId))
    .returning();

  return c.json({ task: updated[0] });
});

task.delete("/:id", async (c) => {
  const taskId = c.req.param("id");
  await db.delete(tasks).where(eq(tasks.id, taskId));
  return c.json({ success: true });
});

export { task as taskRoutes };
