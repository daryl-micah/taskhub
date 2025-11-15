import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import type { Variables } from "../types/api.js";
import z from "zod";
import { db } from "../db/client.js";
import { memberships, taskAssignees } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

const taskAssignment = new Hono<{ Variables: Variables }>();
taskAssignment.use("*", authMiddleware);

const taskAssignmentSchema = z.object({
  userIds: z.array(z.uuid()).min(1, "At least one user ID is required"),
});

// 1. Assign one or more users to a task
taskAssignment.post("/tasks/:id/assign", async (c) => {
  const userId = c.get("userId");
  const taskId = c.req.param("id");
  const body = await c.req.json();
  const res = taskAssignmentSchema.safeParse(body);
  if (!res.success) return c.json({ error: res.error }, 400);

  const { userIds } = res.data;

  // Insert task assignees
  for (const assigneeId of userIds) {
    // RBAC
    if (assigneeId !== userId) {
      const [membership] = await db
        .select()
        .from(memberships)
        .where(eq(memberships.userId, userId));

      if (!membership || !["owner", "admin"].includes(membership.role ?? "")) {
        return c.json({ error: "Forbidden" }, 403);
      }
    }

    await db.insert(taskAssignees).values({
      taskId,
      userId: assigneeId,
    });
  }

  return c.json({ success: true }, 200);
});

// 2. Get all assignees for a task
taskAssignment.get("tasks/:id/assignees", async (c) => {
  const taskId = c.req.param("id");

  const assignees = await db
    .select()
    .from(taskAssignees)
    .where(eq(taskAssignees.taskId, taskId));

  return c.json({ assignees }, 200);
});

// 3. Remove an assignee from a task
taskAssignment.delete("tasks/:id/assignees/:userId", async (c) => {
  const taskId = c.req.param("id");
  const assigneeId = c.req.param("userId");
  const userId = c.get("userId");

  // RBAC
  if (assigneeId !== userId) {
    const [membership] = await db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, userId));
    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return c.json({ error: "Forbidden" }, 403);
    }
  }

  await db
    .delete(taskAssignees)
    .where(
      and(
        eq(taskAssignees.taskId, taskId),
        eq(taskAssignees.userId, assigneeId)
      )
    );

  return c.json({ success: true }, 200);
});
