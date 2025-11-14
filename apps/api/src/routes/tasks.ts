import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import z from "zod";
import type { Variables } from "../types/api.js";
import { db } from "../db/client.js";
import { tasks, memberships } from "../db/schema.js";
import { desc, eq, and, or, inArray } from "drizzle-orm";

const task = new Hono<{ Variables: Variables }>();
task.use("*", authMiddleware);

// Zod schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  ownerType: z.enum(["user", "group"]),
  ownerId: z.uuid(),
  status: z.enum(["open", "in_progress", "completed"]).default("open"),
  dueAt: z.iso.datetime({ offset: false }),
});

// 1. Create a new task (personal or group)
task.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const res = taskSchema.safeParse(body);
  if (!res.success) return c.json({ error: res.error }, 400);

  const { ownerType, ownerId } = res.data;

  // If group task, verify membership
  if (ownerType === "group") {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(
        and(eq(memberships.groupId, ownerId), eq(memberships.userId, userId))
      );

    if (!membership)
      return c.json({ error: "Not a member of this group" }, 403);
  }

  const [newTask] = await db
    .insert(tasks)
    .values({
      ...res.data,
      dueAt: new Date(res.data.dueAt),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return c.json({ task: newTask }, 201);
});

// 2. Get all tasks visible to the user (personal + group)
task.get("/", async (c) => {
  const userId = c.get("userId");
  const page = Number(c.req.query("page") ?? "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  // Get group IDs where user is a member
  const groupRows = await db
    .select({ groupId: memberships.groupId })
    .from(memberships)
    .where(eq(memberships.userId, userId));

  const groupIds = groupRows.map((g) => g.groupId);

  const visibleTasks = await db
    .select()
    .from(tasks)
    .where(
      or(
        and(eq(tasks.ownerType, "user"), eq(tasks.ownerId, userId)),
        and(eq(tasks.ownerType, "group"), inArray(tasks.ownerId, groupIds))
      )
    )
    .orderBy(desc(tasks.createdAt))
    .limit(limit)
    .offset(offset);

  return c.json({ tasks: visibleTasks }, 200);
});

// 3. Update a task (must be visible to user)
task.put("/:id", async (c) => {
  const taskId = c.req.param("id");
  const body = await c.req.json();
  const res = taskSchema.safeParse(body);
  if (!res.success) return c.json({ error: res.error }, 400);

  // Optional: verify ownership before update
  const [updated] = await db
    .update(tasks)
    .set({
      ...res.data,
      dueAt: new Date(res.data.dueAt),
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning();

  return c.json({ task: updated }, 200);
});

// 4. Delete task
task.delete("/:id", async (c) => {
  const taskId = c.req.param("id");

  // Optional: verify ownership before delete
  await db
    .update(tasks)
    .set({ deletedAt: new Date() })
    .where(eq(tasks.id, taskId));

  return c.json({ success: true }, 200);
});

export { task as taskRoutes };
