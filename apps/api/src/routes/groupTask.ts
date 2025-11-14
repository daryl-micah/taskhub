import { Hono } from "hono";
import type { Variables } from "../types/api.js";
import { authMiddleware } from "../middleware/auth.js";
import z from "zod";
import { requireRole } from "../middleware/requireRole.js";
import { db } from "../db/client.js";
import { tasks } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

const groupTask = new Hono<{ Variables: Variables }>();
groupTask.use("*", authMiddleware);

const groupTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  status: z.enum(["open", "in_progress", "completed"]).default("open"),
  dueAt: z.iso.datetime({ offset: false }).optional(),
});

// 1. Create a new group task
groupTask.post(
  "/:id/tasks",
  requireRole("id", ["owner", "admin"]),
  async (c) => {
    const groupId = c.req.param("id");
    const body = await c.req.json();
    const res = groupTaskSchema.safeParse(body);
    if (!res.success) return c.json({ error: res.error }, 400);

    const { title, description, status, dueAt } = res.data;

    const [newTask] = await db
      .insert(tasks)
      .values({
        title,
        description,
        ownerType: "group",
        ownerId: groupId,
        status,
        dueAt: dueAt ? new Date(dueAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return c.json({ task: newTask }, 201);
  }
);

// 2. Get all tasks for a group
groupTask.get(
  "/:id/tasks",
  requireRole("id", ["owner", "admin", "member"]),
  async (c) => {
    const groupId = c.req.param("id");

    const groupTasks = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.ownerId, groupId), eq(tasks.ownerType, "group")));

    return c.json({ tasks: groupTasks }, 200);
  }
);

// 3. Update a group task
groupTask.put(
  "/:id/tasks/:taskId",
  requireRole("id", ["owner", "admin"]),
  async (c) => {
    const groupId = c.req.param("id");
    const taskId = c.req.param("taskId");
    const body = await c.req.json();
    const res = groupTaskSchema.partial().safeParse(body);
    if (!res.success) return c.json({ error: res.error }, 400);

    const [updated] = await db
      .update(tasks)
      .set({
        ...res.data,
        dueAt: res.data.dueAt ? new Date(res.data.dueAt) : null,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.ownerId, groupId)))
      .returning();

    return c.json({ task: updated }, 200);
  }
);

// 4. Delete a group task
groupTask.delete(
  ":id/tasks/:taskId",
  requireRole("id", ["owner", "admin"]),
  async (c) => {
    const groupId = c.req.param("id");
    const taskId = c.req.param("taskId");

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.ownerId, groupId)));

    return c.json({ success: true }, 200);
  }
);

export { groupTask as groupTaskRoutes };
